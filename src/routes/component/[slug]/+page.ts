import type { Components, Level, Structure, TechniqueMeta } from '$types/types';
import { validLevels } from '$lib/levels';
import structureJson from '$lib/data/structure.json';

const structure: Structure = structureJson;

function getDescription(component: string) {
	for (const category of structure.categories) {
		for (const comp of category.components) {
			if (comp.title === component) {
				return comp.description;
			}
		}
	}
}

export async function load({ fetch, params, url }) {
	const level = (url.searchParams.get('level') as Level) || ('AA' as Level);
	// get category from params.slug
	const { slug } = params;
	const introText = getDescription(slug);

	const response = await fetch('../../api/techniques');
	const techniques: TechniqueMeta[] = await response.json();
	const techniqueGroup: Record<string, string> = {};

	techniques.forEach((technique) => {
		if (
			technique.components.includes(slug as Components) &&
			validLevels[level].includes(technique.level)
		) {
			techniqueGroup[technique.title] = technique.slug;
		}
	});

	// Filter posts to only include those where the `components` array contains the slug
	const filteredTechniques = techniques.filter(
		(technique) =>
			technique.components.includes(slug as Components) &&
			validLevels[level].includes(technique.level)
	);

	return { techniques: filteredTechniques, techniqueGroup, introText, slug };
}
