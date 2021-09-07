export interface AuthorMap {
	id: number;
	display_name: string;
	avatar_url: string;
}

export interface CourseLinksMap {
	self: [{ href: string }];
	collection: [{ href: string }];
}

export interface CourseDataMap {
	id: number;
	name: string;
	slug: string;
	permalink: string;
	preview_permalink: string;
	status: string;
	description: string;
	short_description: string;
	reviews_allowed: boolean;
	paret_id: number;
	menu_order: number;
	author: AuthorMap;
	date_created: string;
	date_modified: string;
	featured: false;
	featured_image: number;
	price: number;
	regular_price: number;
	sale_price: number;
	price_type: string;
	categories: string[];
	tags: string[];
	difficulty_id: number;
	enrollment_limit: number;
	duration: number;
	access_mode: string;
	show_curriculum: boolean;
	_links: CourseLinksMap;
	highlights: string;
}
