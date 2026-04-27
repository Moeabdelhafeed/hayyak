<template>
     <Html  :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" class="scrollbar-thin scrollbar-thumb-primary scrollbar-track-primary/10 light">
      <Head>
         <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sanchez:ital@0;1&display=swap" rel="stylesheet">
        <template v-for="link in head.link" :key="link.key">
          <Link :id="link.key" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.key">
          <Meta :id="meta.key" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body class="font-[Sanchez] ">
        <DefaultNavbar />
        <NuxtPage />
        <DefaultFooter />
      </Body>
    </Html>
</template>

<script setup>

const head = useLocaleHead()

</script>

<style  scoped>

</style>