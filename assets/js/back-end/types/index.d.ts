export interface GeneralSettingsMap {
	styling: {
		primary_color: string;
		theme: string;
	};
}

export interface CourseArchiveSettingsMap {
	display: {
		enable_search: boolean;
		per_page: number;
		per_row: number;
		thumbnail_size: string;
	};
}
export interface SingleCourseSettingsMap {
	display: {
		enable_review: boolean;
	};
}

export interface LearningPageSettingsMap {
	display: {
		enable_questions_answers: boolean;
	};
}
export interface PaymentsSettingsMap {
	store: {
		country: string;
		city: string;
		state: string;
		address_line1: string;
		address_line2: string;
	};
	currency: {
		currency: string;
		currency_position: string;
		thousand_separator: string;
		decimal_separator: string;
		number_of_decimals: number;
	};
	offline: {
		enable: boolean;
		title: string;
		description: string;
		instructions: string;
	};
	paypal: {
		enable: boolean;
		title: string;
		description: string;
		ipn_email_notifications: boolean;
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
}

export interface QuizSettingsMap {
	styling: {
		questions_display_per_page: number;
	};
}

export interface EmailsSetttingsMap {
	general: {
		enable: boolean;
		from_name: string;
		from_email: string;
		default_content: string;
		header_image: string;
		footer_text: string;
	};
	new_order: {
		enable: boolean;
		recipients: array;
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
		recipients: array;
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
}

export interface AdvancedSettingsMap {
	pages: {
		course_list_page_id: number;
		learning_page_id: number;
		myaccount_page_id: number;
		checkout_page_id: number;
		terms_conditions_page_id: number;
	};
	permalinks: {
		category_base: string;
		tag_base: string;
		difficulty_base: string;
		single_course_permalink: string;
		single_lesson_permalink: string;
		single_quiz_permalink: string;
		single_section_permalink: string;
	};
	account: {
		orders: string;
		view_order: string;
		my_courses: string;
		edit_account: string;
		payment_methods: string;
		lost_password: string;
		logout: string;
	};
	checkout: {
		pay: string;
		order_received: string;
		add_payment_method: string;
		delete_payment_method: string;
		set_default_payment_method: string;
	};
	debug: {
		template_debug: boolean;
		debug: boolean;
	};
}

export interface SetttingsMap {
	general: GeneralSettingsMap;
	course_archive: CourseArchiveSettingsMap;
	single_course: SingleCourseSettingsMap;
	learning_page: LearningPageSettingsMap;
	payments: PaymentsSettingsMap;
	quiz: QuizSettingsMap;
	emails: EmailsSetttingsMap;
	advance: AdvancedSettingsMap;
}
