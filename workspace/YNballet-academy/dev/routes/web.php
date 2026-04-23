<?php

// ─── 사용자 라우트 ────────────────────────────────────────
$router->get('/',               'HomeController@index');
$router->get('/about',          'AboutController@index');
$router->get('/course',         'CourseController@index');

$router->get('/notice',         'NoticeController@index');
$router->get('/notice/:id',     'NoticeController@show');

$router->get('/inquiry',        'InquiryController@index');
$router->get('/inquiry/write',  'InquiryController@create');
$router->post('/inquiry/write', 'InquiryController@store');
$router->get('/inquiry/check',  'InquiryController@showCheck');   // 비밀번호 확인 페이지
$router->post('/inquiry/check', 'InquiryController@checkPassword');
$router->get('/inquiry/:id',    'InquiryController@show');

// ─── 관리자 라우트 ────────────────────────────────────────
$router->get('/admin/login',    'AdminAuthController@showLogin');
$router->post('/admin/login',   'AdminAuthController@login');
$router->get('/admin/logout',   'AdminAuthController@logout');

// 공지사항
$router->get('/admin/notice',           'AdminNoticeController@index');
$router->get('/admin/notice/write',     'AdminNoticeController@create');
$router->post('/admin/notice/write',    'AdminNoticeController@store');
$router->get('/admin/notice/:id/edit',  'AdminNoticeController@edit');
$router->post('/admin/notice/:id/edit', 'AdminNoticeController@update');
$router->post('/admin/notice/:id/toggle', 'AdminNoticeController@toggle');

// 팝업
$router->get('/admin/popup',                'AdminPopupController@index');
$router->get('/admin/popup/write',          'AdminPopupController@create');
$router->post('/admin/popup/write',         'AdminPopupController@store');
$router->get('/admin/popup/:id/edit',       'AdminPopupController@edit');
$router->post('/admin/popup/:id/edit',      'AdminPopupController@update');
$router->post('/admin/popup/:id/toggle',    'AdminPopupController@toggle');
$router->post('/admin/popup/:id/delete',    'AdminPopupController@delete');

// 카테고리
$router->get('/admin/category',                   'AdminCategoryController@index');
$router->get('/admin/category/write',             'AdminCategoryController@create');
$router->post('/admin/category/write',            'AdminCategoryController@store');
$router->get('/admin/category/:id/edit',          'AdminCategoryController@edit');
$router->post('/admin/category/:id/edit',         'AdminCategoryController@update');
$router->post('/admin/category/:id/delete',       'AdminCategoryController@delete');

// 과정
$router->get('/admin/course',           'AdminCourseController@index');
$router->get('/admin/course/write',     'AdminCourseController@create');
$router->post('/admin/course/write',    'AdminCourseController@store');
$router->get('/admin/course/:id/edit',  'AdminCourseController@edit');
$router->post('/admin/course/:id/edit', 'AdminCourseController@update');
$router->post('/admin/course/:id/toggle', 'AdminCourseController@toggle');
$router->get('/admin/course/sort',      'AdminCourseController@sort');
$router->post('/admin/course/sort',     'AdminCourseController@updateSort');

// 문의
$router->get('/admin/inquiry',                  'AdminInquiryController@index');
$router->get('/admin/inquiry/:id',             'AdminInquiryController@show');
$router->post('/admin/inquiry/:id/status',     'AdminInquiryController@updateStatus');
$router->post('/admin/inquiry/:id/memo',       'AdminInquiryController@saveMemo');
$router->post('/admin/inquiry/:id/answer',     'AdminInquiryController@saveAnswer');

// 이미지 업로드
$router->post('/admin/upload-image',    'AdminUploadController@store');
