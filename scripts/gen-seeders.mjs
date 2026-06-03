// Generates backend seeder data files from the frontend's current static content.
// Output: /seeder-data/*.json  (EN + AR, images & icons left blank for backend to fill)
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'translations.en.json'), 'utf8'))
const ar = JSON.parse(fs.readFileSync(path.join(ROOT, 'translations.ar.json'), 'utf8'))
const OUT = path.join(ROOT, 'seeder-data')
fs.mkdirSync(OUT, { recursive: true })

const write = (name, data) => {
    fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + '\n')
    console.log('wrote', name)
}
// pick a key from a dict, fall back to the other lang, then to ''
const pick = (dict, other, key) => (dict[key] ?? other[key] ?? '')

// ---- load services structure from data.js (strip lucide + icon refs) ----
let src = fs.readFileSync(path.join(ROOT, 'app/components/Services/data.js'), 'utf8')
src = src.replace(/import[\s\S]*?from 'lucide-vue-next'\s*/, '')
src = src.replace(/Lucide[A-Za-z0-9]+/g, '""')
src = src.replace(/export const services\s*=/, 'return ')
const serviceStructs = new Function(src)()

// build one service object for a given language dict
const buildService = (s, dict, other) => {
    const k = (suf) => `service_${s.slug}_${suf}`
    const T = (suf, fb) => (dict[k(suf)] ?? other[k(suf)] ?? fb ?? '')

    const hero = s.hero ? {
        eyebrow: T('hero_eyebrow', s.hero.eyebrow),
        title: T('hero_title', s.hero.title),
        highlight: T('hero_highlight', s.hero.highlight),
        sub: T('hero_sub', s.hero.sub),
    } : null

    const stats = (s.stats ?? []).map((st, i) => ({
        value: T(`stat_${i + 1}_value`, st.value),
        label: T(`stat_${i + 1}_label`, st.label),
    }))

    const sections = (s.sections ?? []).map((sec, si) => {
        const sk = (suf) => `section_${si + 1}_${suf}`
        const base = {
            type: sec.type,
            eyebrow: T(sk('eyebrow'), sec.eyebrow),
            title: T(sk('title'), sec.title),
            intro: sec.intro != null ? T(sk('intro'), sec.intro) : '',
            icon: '',
        }
        if (sec.type === 'lifecycle' && sec.steps) {
            base.steps = sec.steps.map((step, j) => ({
                icon: '',
                label: T(sk(`step_${j + 1}_label`), step.label),
                desc: T(sk(`step_${j + 1}_desc`), step.desc),
            }))
        }
        if (sec.type === 'deliverables' && sec.rows) {
            base.rows = sec.rows.map((row, j) => ({
                doc: T(sk(`row_${j + 1}_doc`), row.doc),
                desc: T(sk(`row_${j + 1}_desc`), row.desc),
                phase: T(sk(`row_${j + 1}_phase`), row.phase),
                frequency: T(sk(`row_${j + 1}_frequency`), row.frequency),
            }))
        }
        if (sec.items) {
            base.items = sec.items.map((item, j) => {
                const ik = (suf) => sk(`item_${j + 1}_${suf}`)
                const m = { icon: '' }
                if (item.num != null) m.num = item.num
                if (item.title != null) m.title = T(ik('title'), item.title)
                if (item.body != null) m.body = T(ik('body'), item.body)
                if (item.label != null) m.label = T(ik('label'), item.label)
                if (item.phase != null) m.phase = T(ik('phase'), item.phase)
                if (item.tags) m.tags = item.tags.map((tg, ti) => T(ik(`tag_${ti + 1}`), tg))
                if (item.items) m.items = item.items.map((sub, ti) => T(ik(`sub_${ti + 1}`), sub))
                return m
            })
        }
        return base
    })

    const cta = s.cta ? {
        eyebrow: T('cta_eyebrow', s.cta.eyebrow),
        title: T('cta_title', s.cta.title),
        body: T('cta_body', s.cta.body),
    } : null

    return {
        slug: s.slug,
        title: T('title', s.title),
        tag: T('tag', s.tag),
        short: T('short', s.short),
        desc: T('desc', s.desc),
        image: '',
        icon: '',
        order: 0,
        bullets: (s.bullets ?? []).map((b, i) => ({ icon: '', text: T(`bullet_${i + 1}`, b.text) })),
        hero, stats, sections, cta,
    }
}

const servicesFor = (dict, other) => serviceStructs.map((s, i) => ({ ...buildService(s, dict, other), order: i + 1 }))
write('services.json', { en: servicesFor(en, ar), ar: servicesFor(ar, en) })

// ---- ABOUT ----
const aboutFor = (d, o) => ({
    hero: { title: pick(d, o, 'about_hero_title'), description: pick(d, o, 'about_hero_body'), image: '' },
    why_hayyak: {
        title: pick(d, o, 'about_welcome_title'),
        description: [pick(d, o, 'about_welcome_p1'), pick(d, o, 'about_welcome_p2')].filter(Boolean).join('\n\n'),
        image: '',
    },
    ventures: [
        { title: pick(d, o, 'about_jv_thabat_title'), description: pick(d, o, 'about_jv_thabat_body'), logo: '', order: 1 },
        { title: pick(d, o, 'about_jv_brightlevant_title'), description: pick(d, o, 'about_jv_brightlevant_body'), logo: '', order: 2 },
    ],
    pillars: [1, 2, 3].map(n => ({
        title: pick(d, o, `about_pillars_${n}_title`), description: pick(d, o, `about_pillars_${n}_body`), icon: '', order: n,
    })),
    comparison: [1, 2, 3, 4].map(n => ({
        traditional: pick(d, o, `about_comparison_row${n}_trad`), hayyak: pick(d, o, `about_comparison_row${n}_hayyak`), order: n,
    })),
})
write('about.json', { en: aboutFor(en, ar), ar: aboutFor(ar, en) })

// ---- FAQS (flat list, language-aware) ----
const faqsFor = (d, o) => {
    const out = []
    for (const g of ['owners', 'tenants']) {
        for (let i = 1; i <= 3; i++) {
            const q = pick(d, o, `about_faq_${g}_q${i}`)
            if (!q) continue
            out.push({ group: g, question: q, answer: pick(d, o, `about_faq_${g}_a${i}`), order: i })
        }
    }
    return out
}
write('faqs.json', { en: faqsFor(en, ar), ar: faqsFor(ar, en) })

// ---- HOME ----
// hero stat values + market metric values are hardcoded in components (not translations)
const HERO_STAT_META = [
    { key: 'experience', value: 15, suffix: '+' },
    { key: 'sold', value: 200, suffix: '+' },
    { key: 'satisfaction', value: 98, suffix: '%' },
]
const MARKET_META = [
    { key: 'avg_price', value: 'JOD 1,240' },
    { key: 'volume', value: '+14% YoY' },
    { key: 'occupancy', value: '87%' },
    { key: 'dom', value: 'Avg 42' },
]
const WHY_STATS = ['sqm', 'satisfaction', 'properties', 'experience']
const homeFor = (d, o) => ({
    hero: {
        media_type: 'video',
        video_url: '',
        image_url: '',
        title: pick(d, o, 'home_hero_title'),
        title_accent: pick(d, o, 'home_hero_title_accent'),
        subtitle: pick(d, o, 'home_hero_subtitle'),
        stats: HERO_STAT_META.map(s => ({ icon: '', value: s.value, suffix: s.suffix, label: pick(d, o, `home_hero_stat_${s.key}`) })),
    },
    why_us: {
        eyebrow: pick(d, o, 'home_whyus_eyebrow'),
        title: pick(d, o, 'home_whyus_title'),
        title_accent: pick(d, o, 'home_whyus_title_accent'),
        body: pick(d, o, 'home_whyus_body'),
        points: [1, 2, 3, 4].map(n => pick(d, o, `home_whyus_point_${n}`)).filter(Boolean),
        stats: WHY_STATS.map(s => ({ value: pick(d, o, `home_whyus_stat_${s}_value`), label: pick(d, o, `home_whyus_stat_${s}_label`) })),
    },
    market_metrics: MARKET_META.map(m => ({ icon: '', label: pick(d, o, `home_insights_stat_${m.key}`), value: m.value })),
    cta: { title: pick(d, o, 'home_cta_title'), body: pick(d, o, 'home_cta_body') },
})
write('home.json', { en: homeFor(en, ar), ar: homeFor(ar, en) })

// ---- INSIGHTS (sample blog posts from the home insight cards) ----
const insightsFor = (d, o) => [1, 2, 3].map(n => ({
    title: pick(d, o, `home_insights_post_${n}_title`),
    excerpt: pick(d, o, `home_insights_post_${n}_body`),
    body: pick(d, o, `home_insights_post_${n}_body`),
    category: pick(d, o, `home_insights_post_${n}_tag`),
    cover_image: '',
    published_at: pick(d, o, `home_insights_post_${n}_date`),
}))
write('insights.json', { en: insightsFor(en, ar), ar: insightsFor(ar, en) })

// ---- AREAS (editorial; EN only — AR not present in source) ----
let asrc = fs.readFileSync(path.join(ROOT, 'app/components/Areas/data.js'), 'utf8')
asrc = asrc.replace(/export const areas\s*=/, 'return ')
const areaStructs = new Function(asrc)()
const areas = areaStructs.map(a => ({
    name: a.title,
    tagline: a.tag || '',
    description: a.desc || '',
    practical_info: a.practical || '',
    dining: a.dining || [],
    shopping: a.shopping || [],
    landmarks: a.landmarks || [],
    image: '',
}))

// Arabic editorial (translated from the English source)
const AREAS_AR = {
    'Abdoun': {
        name: 'عبدون',
        tagline: 'مايفير عمّان',
        description: 'عبدون هو القلب المؤسسي لعمّان، وأرقى أحيائها السكنية والدبلوماسية. يُعرف بـ«مايفير عمّان»، إذ يجمع بين مجمعات السفارات عالية الأمان ومشهد اجتماعي عالمي.',
        practical_info: 'أغلى منطقة في الأردن. ستوديوهات تبدأ من 600 دولار شهرياً، وفلل فاخرة حتى 4,500+ دولار شهرياً. وصول مباشر لطريق المطار (25-30 دقيقة). قرب أرقى المدارس الدولية.',
        dining: ['بلو فيغ — الملتقى الاجتماعي للحي', 'صالت ستيك هاوس في فيرمونت — ستيك فاخر', 'ذا ماتشا كلوب — وجهة صحية رائجة'],
        shopping: ['تاج لايف ستايل سنتر — أرقى مول فاخر', 'دوار عبدون — بوتيكات ومتاجر بقالة فاخرة'],
        landmarks: ['جسر عبدون — جسر معلّق أيقوني', 'الحديقة اليابانية — مساحة خضراء هادئة'],
    },
    'Dabouq': {
        name: 'دابوق',
        tagline: 'ثراء هادئ وفخامة ضاحية',
        description: 'دابوق قمة الفخامة الضاحية في عمّان، وأكثر أحيائها السكنية حصرية. يمنح إحساساً مميزاً بـ«الثراء الهادئ» — عقارات واسعة ومجمعات مغلقة ونسيم بعبق الصنوبر.',
        practical_info: 'أغلى أرض في المملكة. سكني بالغالب، والمباني محدودة بـ 3-4 طوابق. آمن للغاية لقربه من المقار الملكية.',
        dining: ['ذا فيليج — تجمّع وجهات لايف ستايل', 'لينكونترو — إيطالي أصيل', 'نايرو — آسيوي راقٍ'],
        shopping: ['دابوق ديستريكت — مركز حديث مفتوح', 'كوزمو آند كوزمو — سوبرماركت فاخر'],
        landmarks: ['مسجد الملك الحسين بن طلال', 'المتحف الملكي للسيارات'],
    },
    'Abdali': {
        name: 'العبدلي',
        tagline: 'وسط عمّان الجديد',
        description: 'العبدلي هو «وسط عمّان الجديد» — شاهد من الزجاج والفولاذ على مستقبل الأردن. حيّ الأعمال المركزي بطابع حضري حقيقي، بأبراج شاهقة وبوليفارد للمشاة وطاقة على مدار الساعة.',
        practical_info: 'شقق فاخرة في أبراج عالية. أكثر النقاط مركزية في عمّان. 5 دقائق لوسط البلد القديم. أكثر أحياء المدينة ملاءمةً للمشي.',
        dining: ['هاي غاردن آند يو روف — إطلالات بانورامية', 'فيو (VUE) — قائمة عالمية راقية', 'أسطرلاب — مقهى روّاد الأعمال'],
        shopping: ['مول العبدلي — الأحدث في الأردن', 'البوليفارد — ممشى بطول 370م بأسواق موسمية'],
        landmarks: ['فندق W عمّان بمدخله الأيقوني «الكانيون»', 'برج روتانا — الأطول في الأردن'],
    },
    'Aqaba (Tala Bay)': {
        name: 'العقبة (تالا باي)',
        tagline: 'حياة منتجعات البحر الأحمر',
        description: 'تالا باي هي أرقى مجتمع منتجعات متكامل في العقبة، تقدّم نمط حياة راقٍ ومكتفٍ ذاتياً بعمارة تمزج المتوسطي بالشامي وساحل خاص على البحر الأحمر بطول 2 كم.',
        practical_info: 'ستوديوهات وكبائن وفلل بمسابح. شائعة كمنازل عطلات وإيجارات للمغتربين. 15 دقيقة لوسط المدينة، و20 دقيقة للمطار.',
        dining: ['سوزانا — مطبخ عالمي وغروب', 'ديسوتو — إيطالي أصيل عند المرسى', 'تالا باي بيتش كلوب — طعام عند المسبح'],
        shopping: ['مارينا بلازا — متاجر ومقاهٍ ومساكن'],
        landmarks: ['المرسى — منشأة حديثة', 'محمية العقبة البحرية — غوص عالمي المستوى'],
    },
}
const areasArOut = areaStructs.map(a => ({ ...(AREAS_AR[a.title] ?? { name: a.title }), image: '' }))
write('areas.json', { en: areas, ar: areasArOut })

// ---- SETTINGS (contact + social; current known values) ----
write('settings.json', {
    en: {
        app_phone: '+962 6 123 4567',
        app_whatsapp: '',
        app_email: 'info@hayyak.jo',
        app_address: 'Amman, Jordan',
        app_address_url: 'https://www.google.com/maps/dir/?api=1&destination=Amman+Jordan',
        working_hours: 'Sun-Thu: 9:00AM-5:00PM',
        logo_en: '',
        logo_ar: '',
        social: {
            facebook: 'https://facebook.com/hayyak',
            instagram: 'https://instagram.com/hayyak',
            twitter: 'https://twitter.com/hayyak',
            linkedin: 'https://linkedin.com/company/hayyak',
            tiktok: '', youtube: '', snapchat: '',
        },
    },
    ar: {
        app_address: 'عمّان، الأردن',
        working_hours: 'الأحد-الخميس: 9:00ص-5:00م',
    },
})

console.log('done -> seeder-data/')
