const routes = {
	stats: {
		index: '/stats',
	},
	urlSchemes: {
		list: '/url-schemes',
		add: '/url-schemes/new',
		edit: '/url-schemes/:urlSchemId/edit',
	},
	settings: '/settings',
	debugger: '/debugger',
	notFound: '/not-found',

	// Junk.
	course: '/courses/:courseId',
	courses: {
		list: '/courses',
		add: '/courses/add-new-course',
		edit: '/courses/:courseId/edit',
		settings: '/courses/:courseId/settings',
	},
	orders: {
		list: '/orders',
		edit: '/orders/:orderId',
	},
	section: '/courses/:courseId/section',
	lesson: {
		add: '/courses/:courseId/lesson/:sectionId/add-new-lesson',
		edit: '/courses/:courseId/lesson/edit/:lessonId',
	},
	quiz: {
		add: '/courses/:courseId/quiz/:sectionId/add-new-quiz',
		edit: '/courses/:courseId/quiz/edit/:quizId',
	},
	course_categories: {
		list: '/courses/categories',
		add: '/courses/categories/new',
		edit: '/courses/categories/:categoryId',
	},
	course_tags: {
		list: '/courses/tags',
		add: '/courses/tags/new',
		edit: '/courses/tags/:tagId',
	},
};

export default routes;
