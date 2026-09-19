import React from 'react';
import { CoursePerformance, CoursePerformanceProps } from './CoursePerformance';

export interface FacultyCoursePerformanceProps extends CoursePerformanceProps {}

export const FacultyCoursePerformance: React.FC<FacultyCoursePerformanceProps> = (props) => {
  return <CoursePerformance {...props} />;
};

export { CoursePerformance };
export default CoursePerformance;
