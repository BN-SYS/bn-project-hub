<?php

// ─── 사용자 라우트 ────────────────────────────────────────
$router->get('/',               'HomeController@index');
$router->get('/about',          'AboutController@index');
$router->get('/course',         'CourseController@index');

// 회원 인증
$router->get('/register',       'AuthController@showRegister');
$router->post('/register',      'AuthController@register');
$router->get('/login',          'AuthController@showLogin');
$router->post('/login',         'AuthController@login');
$router->get('/logout',         'AuthController@logout');

// 이메일 인증 API
$router->post('/api/check-username',      'AuthController@apiCheckUsername');
$router->post('/api/check-email',         'AuthController@apiCheckEmail');
$router->post('/api/send-email-code',     'AuthController@apiSendEmailCode');
$router->post('/api/verify-email-code',   'AuthController@apiVerifyEmailCode');

$router->get('/notice',         'NoticeController@index');
$router->get('/notice/:id',     'NoticeController@show');

$router->get('/inquiry',        'InquiryController@index');
$router->get('/inquiry/write',  'InquiryController@create');
$router->post('/inquiry/write', 'InquiryController@store');
$router->get('/inquiry/check',  'InquiryController@showCheck');   // 비밀번호 확인 페이지
$router->post('/inquiry/check', 'InquiryController@checkPassword');
$router->get('/inquiry/:id',    'InquiryController@show');

$router->get('/schedule',           'ScheduleController@index');

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

// 수업 일정
$router->get('/admin/schedule',                   'AdminScheduleController@index');
$router->get('/admin/schedule/preview',           'AdminScheduleController@preview');
$router->get('/admin/schedule/write',             'AdminScheduleController@create');
$router->post('/admin/schedule/write',            'AdminScheduleController@store');
$router->get('/admin/schedule/:id/edit',          'AdminScheduleController@edit');
$router->post('/admin/schedule/:id/edit',         'AdminScheduleController@update');
$router->post('/admin/schedule/:id/delete',       'AdminScheduleController@delete');

// 배너
$router->get('/admin/banner',                 'AdminBannerController@index');
$router->get('/admin/banner/write',           'AdminBannerController@create');
$router->post('/admin/banner/write',          'AdminBannerController@store');
$router->get('/admin/banner/sort',            'AdminBannerController@sort');
$router->post('/admin/banner/sort',           'AdminBannerController@updateSort');
$router->get('/admin/banner/:id/edit',        'AdminBannerController@edit');
$router->post('/admin/banner/:id/edit',       'AdminBannerController@update');
$router->post('/admin/banner/:id/toggle',     'AdminBannerController@toggle');
$router->post('/admin/banner/:id/delete',     'AdminBannerController@delete');

// 클래스 관리
$router->get('/admin/class-group',                  'AdminClassGroupController@index');
$router->get('/admin/class-group/write',            'AdminClassGroupController@create');
$router->post('/admin/class-group/write',           'AdminClassGroupController@store');
$router->get('/admin/class-group/:id/edit',         'AdminClassGroupController@edit');
$router->post('/admin/class-group/:id/edit',        'AdminClassGroupController@update');
$router->post('/admin/class-group/:id/delete',      'AdminClassGroupController@delete');

// 회원 관리
$router->get('/admin/member',                       'AdminMemberController@index');
$router->get('/admin/member/write',                 'AdminMemberController@create');
$router->post('/admin/member/write',                'AdminMemberController@store');
$router->get('/admin/member/export',                'AdminMemberController@export');
$router->get('/admin/member/:id/edit',              'AdminMemberController@edit');
$router->post('/admin/member/:id/edit',             'AdminMemberController@update');
$router->post('/admin/member/:id/delete',           'AdminMemberController@delete');

// 원비 관리
$router->get('/admin/tuition',                      'AdminTuitionController@index');
$router->get('/admin/tuition/stats',                'AdminTuitionController@stats');
$router->get('/admin/tuition/export',               'AdminTuitionController@export');
$router->get('/admin/tuition/stats/export',         'AdminTuitionController@exportStats');
$router->post('/admin/tuition/generate',            'AdminTuitionController@generate');
$router->get('/admin/tuition/:id/edit',             'AdminTuitionController@edit');
$router->post('/admin/tuition/:id/edit',            'AdminTuitionController@update');
$router->post('/admin/tuition/:id/paid',            'AdminTuitionController@markPaid');
$router->post('/admin/tuition/:id/delete',          'AdminTuitionController@delete');

// 계정 설정
$router->get('/admin/settings/profile',  'AdminSettingsController@showProfile');
$router->post('/admin/settings/profile', 'AdminSettingsController@updateProfile');

// 이미지 업로드
$router->post('/admin/upload-image',    'AdminUploadController@store');
