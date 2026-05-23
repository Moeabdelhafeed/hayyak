import { services as raw } from '~/components/Services/data'

export const useServices = () => {
    const { t } = useT()

    const translated = computed(() => raw.map(s => {
        const k = (suffix) => `service_${s.slug}_${suffix}`

        const hero = s.hero ? {
            ...s.hero,
            eyebrow: t(k('hero_eyebrow'), s.hero.eyebrow),
            title: t(k('hero_title'), s.hero.title),
            highlight: t(k('hero_highlight'), s.hero.highlight),
            sub: t(k('hero_sub'), s.hero.sub),
        } : s.hero

        const stats = (s.stats ?? []).map((st, i) => ({
            ...st,
            value: t(k(`stat_${i + 1}_value`), st.value),
            label: t(k(`stat_${i + 1}_label`), st.label),
        }))

        const sections = (s.sections ?? []).map((sec, si) => {
            const sk = (suffix) => k(`section_${si + 1}_${suffix}`)
            const base = {
                ...sec,
                eyebrow: t(sk('eyebrow'), sec.eyebrow),
                title: t(sk('title'), sec.title),
                intro: sec.intro != null ? t(sk('intro'), sec.intro) : sec.intro,
            }

            if (sec.type === 'lifecycle' && sec.steps) {
                base.steps = sec.steps.map((step, j) => ({
                    ...step,
                    label: t(sk(`step_${j + 1}_label`), step.label),
                    desc: t(sk(`step_${j + 1}_desc`), step.desc),
                }))
            }

            if (sec.type === 'deliverables' && sec.rows) {
                base.rows = sec.rows.map((row, j) => ({
                    ...row,
                    doc: t(sk(`row_${j + 1}_doc`), row.doc),
                    desc: t(sk(`row_${j + 1}_desc`), row.desc),
                    phase: t(sk(`row_${j + 1}_phase`), row.phase),
                    frequency: t(sk(`row_${j + 1}_frequency`), row.frequency),
                }))
            }

            if (sec.items) {
                base.items = sec.items.map((item, j) => {
                    const ik = (suffix) => sk(`item_${j + 1}_${suffix}`)
                    const mapped = { ...item }
                    if (item.title != null) mapped.title = t(ik('title'), item.title)
                    if (item.body != null) mapped.body = t(ik('body'), item.body)
                    if (item.label != null) mapped.label = t(ik('label'), item.label)
                    if (item.phase != null) mapped.phase = t(ik('phase'), item.phase)
                    if (item.tags) mapped.tags = item.tags.map((tag, ti) => t(ik(`tag_${ti + 1}`), tag))
                    if (item.items) mapped.items = item.items.map((sub, ti) => t(ik(`sub_${ti + 1}`), sub))
                    return mapped
                })
            }

            return base
        })

        const cta = s.cta ? {
            ...s.cta,
            eyebrow: t(k('cta_eyebrow'), s.cta.eyebrow),
            title: t(k('cta_title'), s.cta.title),
            body: t(k('cta_body'), s.cta.body),
        } : s.cta

        return {
            ...s,
            title: t(k('title'), s.title),
            tag: t(k('tag'), s.tag),
            short: t(k('short'), s.short),
            desc: t(k('desc'), s.desc),
            bullets: s.bullets.map((b, i) => ({
                ...b,
                text: t(k(`bullet_${i + 1}`), b.text),
            })),
            hero,
            stats,
            sections,
            cta,
        }
    }))

    return translated
}
