import { useContext } from 'react';
import { useMutation } from 'react-query';
import urls from '../constants/urls';
import { MasteriyoContext } from '../context/MasteriyoProvider';
import { CourseSchema } from '../schemas';
import API from '../utils/api';
import { deepMerge } from '../utils/utils';

const useCourse = () => {
	const { mtoOptions, setMtoOptions } = useContext(MasteriyoContext);

	const courseId = (mtoOptions && mtoOptions?.course?.id) || false;
	const courseName = (mtoOptions && mtoOptions?.course?.name) || false;
	const previewUrl = (mtoOptions && mtoOptions?.course?.previewUrl) || false;
	const courseAPI = new API(urls.courses);

	const setCourseId = (id: number) => {
		setMtoOptions(deepMerge(mtoOptions, { course: { id: id } }));
	};

	const setCourseName = (name: string) => {
		setMtoOptions(deepMerge(mtoOptions, { course: { name: name } }));
	};

	const setPreviewUrl = (previewUrl: string) => {
		setMtoOptions(
			deepMerge(mtoOptions, { course: { previewUrl: previewUrl } })
		);
	};

	const updateCourse = useMutation(
		({ id, data }: { id: number; data: CourseSchema | any }) =>
			courseAPI.update(id, data)
	);

	const draftCourse = useMutation((id: number) =>
		courseAPI.update(id, { status: 'draft' })
	);

	const publishCourse = useMutation((id: number) =>
		courseAPI.update(id, { status: 'publish' })
	);

	return {
		courseId,
		setCourseId,
		courseName,
		setCourseName,
		previewUrl,
		setPreviewUrl,
		updateCourse,
		draftCourse,
		publishCourse,
	};
};

export default useCourse;
