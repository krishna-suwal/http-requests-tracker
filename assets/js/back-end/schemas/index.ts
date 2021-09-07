export interface QuizSchema {
	id: number;
	name: string;
	slug: string;
	permalink: string;
	parent_id: number;
	course_id: number;
	course_name: string;
	menu_order: number;
	description: string;
	short_description: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	status: 'draft' | 'pending' | 'private' | 'publish' | 'future';
	pass_mark: number;
	full_mark: number;
	duration: number;
	attempts_allowed: number;
	questions_display_per_page: number;
	questions_count: number;
	navigation: {
		previous: {
			id: number;
			name: string;
			type: string;
			parent: {
				id: number;
				name: string;
			};
		};
		next: {
			id: number;
			name: string;
			type: string;
			parent: {
				id: number;
				name: string;
			};
		};
	};
	_links: {
		self: [
			{
				href: string;
			}
		];
		collection: [
			{
				href: string;
			}
		];
		previous: [
			{
				href: string;
			}
		];
		next: [
			{
				href: string;
			}
		];
	};
}

export interface TrueFalseSchema {
	name: string;
	correct: boolean;
}

export interface SingleChoiceSchema {
	name: string;
	correct: boolean;
}

export interface MultipleChoiceSchema {
	name: string;
	correct: boolean;
}

export interface QuestionSchema {
	id: number;
	name: string;
	slug: string;
	permalink?: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	status: 'publish' | 'draft' | string;
	short_description: string;
	description: string;
	type:
		| 'true-false'
		| 'single-choice'
		| 'multiple-choice'
		| 'short-answer'
		| 'image-matching';
	parent_id: number;
	course_id: number;
	menu_order: number;
	answers: [];
	answers_required: boolean;
	randomize: boolean;
	points: number;
	positive_feedback: string;
	negative_feedback: string;
	feedback: string;
	_links: {
		self: [
			{
				href: string;
			}
		];
		collection: [
			{
				href: string;
			}
		];
	};
}

export interface CourseCategorySchema {
	id: number;
	name: string;
	slug: string;
	parent_id: number;
	description: string;
	display: string;
	term_order: number;
	count: number;
}

export interface CourseDifficultySchema {
	id: number;
	name: string;
	slug: string;
	description: string;
	term_order: number;
	count: number;
}

export interface CourseTagSchema {
	id: number;
	name: string;
	slug: string;
	description: string;
	term_order: number;
	count: number;
}

export interface CourseProgressSchema {
	id: number;
	user_id: number;
	course_id: number;
	status: string;
	started_at: string;
	modified_at: string;
	completed_at: string;
}

export interface CourseProgressItemSchema {
	page: number;
	course_id: number;
	user_id: number;
	item_id: number;
	item_type: string;
	completed: boolean;
	started_at: string;
	completed_at: string;
	modified_at: string;
}

export interface CourseQASchema {
	id: number;
	course_id: number;
	user_id: number;
	user_name: string;
	user_email: string;
	user_url: string;
	ip_address: string;
	created_at: string;
	content: string;
	status: string;
	agent: string;
	parent: number;
	by_current_user: boolean;
	sender: string;
}

export interface CourseReviewSchema {
	id: number;
	course_id: number;
	name: string;
	email: string;
	url: string;
	ip_address: string;
	date_created: string;
	description: string;
	title: string;
	content: string;
	rating: number;
	status: string;
	agent: string;
	type: string;
	parent: number;
	author_id: number;
}

export interface CourseSchema {
	id: number;
	name: string;
	slug: string;
	permalink: string;
	preview_permalink: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	status: string;
	featured: boolean;
	catalog_visibility: string;
	description: string;
	short_description: string;
	price: string;
	regular_price: string;
	sale_price: string;
	reviews_allowed: boolean;
	average_rating: string;
	rating_count: number;
	parent_id: number;
	featured_image: number;
	categories: CourseCategorySchema[];
	tags: CourseTagSchema[];
	difficulty: CourseDifficultySchema[];
	menu_order: number;
	enrollment_limit: number;
	duration: number;
	access_mode: string;
	billing_cycle: string;
	show_curriculum: boolean;
	author: {
		id: number;
		display_name: string;
		avatar_url: string;
	};
	_links: {
		self: [
			{
				href: string;
			}
		];
		collection: [
			{
				href: string;
			}
		];
		first: [
			{
				href: string;
			}
		];
	};
}

export interface FaqSchema {
	id: number;
	title: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	content: string;
	course_id: number;
	sort_order: number;
}

export interface LessonSchema {
	id: number;
	name: string;
	slug: string;
	permalink: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	status: string;
	catalog_visibility: string;
	description: string;
	short_description: string;
	reviews_allowed: boolean;
	average_rating: string;
	rating_count: number;
	parent_id: number;
	course_id: number;
	menu_order: number;
	featured_image: number;
	video_source: string;
	video_source_url: string;
	video_playback_time: number;
	course_name: string;
}

export interface SectionSchema {
	id: number;
	name: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	description: string;
	parent_id: number;
	course_id: number;
	menu_order: number;
	course_name: string;
}

export interface OrderSchema {
	id: number;
	permalink: string;
	date_created: string;
	date_created_gmt: string;
	date_modified: string;
	date_modified_gmt: string;
	status: string;
	total: number;
	currency: string;
	expiry_date: string;
	customer_id: string;
	payment_method: string;
	payment_method_title: string;
	transaction_id: string;
	date_paid: string;
	date_completed: string;
	created_via: string;
	customer_ip_address: string;
	customer_user_agent: string;
	version: string;
	order_key: string;
	customer_note: string;
	cart_hash: string;
	billing: {
		first_name: string;
		last_name: string;
		company: string;
		address_1: string;
		address_2: string;
		city: string;
		postcode: string;
		country: string;
		state: string;
		email: string;
		phone: string;
	};
	set_paid: boolean;
	course_lines: {
		id: number;
		course_id: number;
		name: string;
		quantity: number;
		subtotal: string;
		total: string;
		price: number;
	};
}

export interface OrderItemSchema {
	id: number;
	order_id: string;
	course_id: string;
	name: string;
	type: string;
	quantity: number;
	total: number | string;
}

export interface SettingsSchema {
	general: {
		address_line1: string;
		address_line2: string;
		city: string;
		country: string;
		postcode: string;
		currency: string;
		currency_position: string;
		thousand_separator: string;
		decimal_separator: string;
		number_of_decimals: string;
		primary_color: string;
		theme: string;
	};
	courses: {
		enable_search: boolean;
		placeholder_image: number;
		per_page: number;
		per_row: number;
		category_base: string;
		tag_base: string;
		difficulty_base: string;
		single_course_permalink: string;
		single_lesson_permalink: string;
		single_quiz_permalink: string;
		single_section_permalink: string;
		show_thumbnail: boolean;
		thumbnail_size: string;
		enable_review: boolean;
		enable_questions_answers: boolean;
	};
	pages: {
		myaccount_page_id: number;
		course_list_page_id: number;
		terms_conditions_page_id: number;
		checkout_page_id: number;
		checkout_endpoints: {
			pay: string;
			order_received: string;
			add_payment_method: string;
			delete_payment_method: string;
			set_default_payment_method: string;
		};
		account_endpoints: {
			orders: string;
			view_order: string;
			my_courses: string;
			edit_account: string;
			payment_methods: string;
			lost_password: string;
			logout: string;
		};
	};
	quizzes: {
		questions_display_per_page: number;
	};
	payments: {
		enable: boolean;
		title: string;
		description: string;
		ipn_email_notifiations: boolean;
		sandbox: boolean;
		email: string;
		receiver_email: string;
		identity_token: string;
		invoice_prefix: string;
		payment_action: string;
		image_url: string;
		debug: boolean;
		sandbox_api_username: string;
		sandbox_api_password: string;
		sandbox_api_signature: string;
		live_api_username: string;
		live_api_password: string;
		live_api_signature: string;
	};
	emails: {
		general: {
			from_name: string;
			from_email: string;
			default_content: string;
			header_image: string;
			footer_text: string;
		};
		new_order: {
			enable: boolean;
			recipients: string;
			subject: string;
			heading: string;
			content: string;
		};
		processing_order: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
		completed_order: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
		onhold_order: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
		cancelled_order: {
			enable: boolean;
			recipients: string;
			subject: string;
			heading: string;
			content: string;
		};
		enrolled_course: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
		completed_course: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
		become_an_instructor: {
			enable: boolean;
			subject: string;
			heading: string;
			content: string;
		};
	};
	advance: {
		template_debug: boolean;
		debug: boolean;
		style: string;
	};
}

export interface UserSchema {
	id: number;
	username: string;
	password: string;
	nicename: string;
	email: string;
	url: string;
	date_created: string;
	activation_key: string;
	status: string;
	display_name: string;
	nickname: string;
	first_name: string;
	last_name: string;
	description: string;
	rich_editing: boolean;
	syntax_highlighting: boolean;
	comment_shortcuts: boolean;
	spam: boolean;
	use_ssl: boolean;
	show_admin_bar_front: boolean;
	locale: string;
	roles: string[];
	billing: {
		first_name: string;
		last_name: string;
		company: string;
		address_1: string;
		address_2: string;
		city: string;
		postcode: string;
		country: string;
		state: string;
		email: string;
		phone: string;
	};
}

export interface CourseBuilderSchema {
	contents: {
		id: number;
		name: string;
		permalink: string;
		type: string;
		menu_order: number;
		parent_id: number;
	}[];
	sections: SectionSchema[];
	section_order: number[];
}

export interface QuizBuilderSchema {
	contents: {
		id: number;
		name: string;
		permalink: string;
		type: string;
		menu_order: number;
		parent_id: number;
	}[];
}

export interface CountrySchema {
	countryCode: string;
	countryName: string;
	currencyCode: string;
	population: string;
	capital: string;
	continentName: string;
}

export interface CountriesSchema {
	code: string;
	name: string;
}

export interface CurrenciesSchema {
	code: string;
	name: string;
	symbol: string;
}

export interface StatesSchema {
	country: string;
	states: {
		code: string;
		name: string;
	};
}

export interface MediaSchema {
	id: number;
	date: string;
	date_gmt: string;
	guid: {
		rendered: string;
	};
	modified: string;
	modified_gmt: string;
	slug: string;
	status: string;
	type: string;
	link: string;
	title: {
		rendered: string;
	};
	author: number;
	comment_status: string;
	ping_status: string;
	template: string;
	meta: [];
	description: {
		rendered: string;
	};
	caption: {
		rendered: string;
	};
	alt_text: string;
	media_type: string;
	mime_type: string;
	media_details: {
		width: number;
		height: number;
		file: string;
		sizes: {};
		image_meta: {
			aperture: string;
			credit: string;
			camera: string;
			caption: string;
			created_timestamp: string;
			copyright: string;
			focal_length: string;
			iso: string;
			shutter_speed: string;
			title: string;
			orientation: string;
			keywords: [];
		};
	};
	post: number;
	source_url: string;
	_links: {
		self: [
			{
				href: string;
			}
		];
		collection: [
			{
				href: string;
			}
		];
		about: [
			{
				href: string;
			}
		];
		author: [
			{
				embeddable: boolean;
				href: string;
			}
		];
		replies: [
			{
				embeddable: boolean;
				href: string;
			}
		];
	};
}
