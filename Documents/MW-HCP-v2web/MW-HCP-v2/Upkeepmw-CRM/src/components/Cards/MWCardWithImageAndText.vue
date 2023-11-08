<template>
	<div class="row row-cols-lg-3 g-4">
		<div class="col-sm-4">
			<div class="card">
				<img :src="props.image" class="card-img-top" alt="...">
				<div>
					<h5 class="card-title">
						<MWRouterLink :route="'/article-details'">
							<p class="card-text">{{props.title}}</p>
						</MWRouterLink>
					</h5>
					
				</div>

				<div class="mt-4">
					<div class="underlined">
						Author
					</div>
					<p class="card-text">{{props.articleAuthor}}</p>
				</div>

				<div class="mt-4">
					<div class="underlined">
						Published
					</div>
					<span class="card-text">{{props.publishDate}}</span> <span>at {{props.publishTime}}</span>
				</div>

				<div class="mt-4">
					<div class="underlined">
						Tags
					</div>
					<button type="button" class="btn btn-outline-secondary btn-sm">{{props.tags}}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import MWRouterLink from '../Routing/MWRouterLink.vue'

	const props = defineProps({
		title: String,
		articleAuthor: String,
		publishDate: String,
		publishTime: String,
		tags: String
	})

	
</script>

<style scoped>
.underlined {
  text-decoration: underline;
}
</style>