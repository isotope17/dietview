altairApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/login', '/')
                .otherwise('/');

            $stateProvider
            // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/views/error.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })
            // -- LOGIN PAGE --
                .state("login", {
                    url: "/",
                    templateUrl: 'app/components/pages/loginView.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck',
                              //  'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/pages/loginController.js'
                            ]);
                        }]
                    }
                })
            // -- RESET-PASSWORD PAGE --
                .state("resetPassword", {
                    url: "/reset-password?access_token&user_id",
                    templateUrl: 'app/components/pages/resetPasswordView.html',
                    controller: 'resetPasswordCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck',
                              //  'bower_components/angular-resource/angular-resource.min.js',
                                'app/components/pages/resetPasswordController.js'
                            ]);
                        }]
                    }
                })
            // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    url: "",
                    templateUrl: 'app/views/restricted.html',
                    controller: function (User, $state) {
                      if(!User.isAuthenticated){
                        console.log('not authenticated');
                        $state.go('login');
                      }
                  },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes'
                                //'bower_components/angular-resource/angular-resource.min.js'
                            ]);
                        }],
                        user_data: function (User) {
                            var user = User.getCachedCurrent();
                            if(user !== null){
                              return user;
                            } else {
                              return User.getCurrent().$promise.then(function (data) {
                                return data;
                              });
                            }
                        }
                    }
                })
            // -- DASHBOARD --
                .state("restricted.dashboard", {
                    url: "/dashboard",
                    templateUrl: 'app/components/dashboard/dashboardView.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_weathericons',
                                'lazy_clndr',
                                'lazy_google_maps',
                                'app/components/dashboard/dashboardController.js'
                            ], {serie: true} );
                        }],
                        sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    ncyBreadcrumb: {
                        label: 'Home'
                    }
                })
                // == ADMIN --
                .state("restricted.admin", {
                    url: "/admin",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    abstract: true,
                    controller: function (user_data,$state) {
                      if(user_data.account.role !== 'admin') {
                        $state.go('error.404');
                      }
                    },
                    resolve: {
                        user_data: function (User) {
                            var user = User.getCachedCurrent();
                            if(user !== null){
                              return user;
                            } else {
                              return User.getCurrent().$promise.then(function (data) {
                                return data;
                              });
                            }
                        }
                    }
                })
                // MANAGEMENT CONSOLE
                .state("restricted.admin.console", {
                    url: "/console",
                    templateUrl: 'app/components/admin/consoleView.html',
                    controller: 'consoleCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/admin/consoleController.js'
                            ],{serie: true});
                        }],
                        user_list: function(User){
                            return User.find({}).$promise.then(function (data) {
                                return data;
                            });
                        }
                    },
                    data: {
                        pageTitle: 'Management Console'
                    }
                })
                // -- PRODUCTS --
                .state("restricted.products", {
                    url: "/products",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                // -- MEAL ITEMS --
                .state("restricted.products.meal_items", {
                    url: "/meal_items",
                    templateUrl: 'app/components/products/meal_items_listView.html',
                    controller: 'meal_items_listCtrl',
                    resolve: {
                        ingredients_data: function(MealItem){
                            return MealItem.find({}).$promise
                            .then(function (data) {
                              return data;
                            })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/products/meal_items_listController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Meal Items'
                    }
                })
                // -- MEALS --
                .state("restricted.products.meals", {
                    url: "/meals",
                    templateUrl: 'app/components/products/meals_listView.html',
                    controller: 'meals_listCtrl',
                    resolve: {
                        meals_data: function(Meal){
                            return Meal.find({}).$promise
                            .then(function (data) {
                                return data;
                            })
                        },
                        ingredients_data: function (MealItem) {
                            return MealItem.find({}).$promise
                            .then(function (data) {
                                return data;
                            })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_dropify',
                                'lazy_pagination',
                                'app/components/products/meals_listController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Meals'
                    }
                })
                // -- MEAL PLANS --
                .state("restricted.products.meal_plans", {
                    url: "/meal_plans",
                    templateUrl: 'app/components/products/meal_plans_listView.html',
                    controller: 'meal_plans_listCtrl',
                    resolve: {
                        meals_data: function(Meal){
                          return Meal.find({}).$promise
                          .then(function (data) {
                            return data;
                          })
                        },
                        meal_plans_data: function (MealPlan) {
                          return MealPlan.find({}).$promise
                          .then(function (data) {
                            return data;
                          })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/products/meal_plans_listController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Meal Plans'
                    }
                })
                // -- ADD MEAL PLANS --
                .state("restricted.products.meal_plans_add", {
                    url: "/meal_plans/add",
                    templateUrl: 'app/components/products/meal_plans_addView.html',
                    controller: 'meal_plans_addCtrl',
                    resolve: {
                        meals_data: function(Meal){
                          return Meal.find({}).$promise
                          .then(function (data) {
                            return data;
                          })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'lazy_dropify',
                                'app/components/products/meal_plans_addController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'New Meal Plan'
                    }
                })
                // -- EDIT MEAL PLANS --
                .state("restricted.products.meal_plans_edit", {
                    url: "/meal_plans/edit?id",
                    templateUrl: 'app/components/products/meal_plans_editView.html',
                    controller: 'meal_plans_editCtrl',
                    resolve: {
                        meals_data: function(Meal){
                          return Meal.find({}).$promise
                          .then(function (data) {
                            return data;
                          })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'lazy_dropify',
                                'app/components/products/meal_plans_editController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Edit Meal Plan'
                    }
                })
                // -- DETAILS MEAL PLANS --
                .state("restricted.products.meal_plans_details", {
                    url: "/meal_plans/details?id",
                    templateUrl: 'app/components/products/meal_plans_detailsView.html',
                    controller: 'meal_plans_detailsCtrl',
                    resolve: {
                        meals_data: function(Meal){
                          return Meal.find({}).$promise
                          .then(function (data) {
                            return data;
                          })
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'lazy_dropify',
                                'app/components/products/meal_plans_detailsController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Meal Plan Details'
                    }
                })
                // -- SUBSCRIPTIONS --
                .state("restricted.subscriptions", {
                    url: "/subscriptions",
                    template: '<div ui-view autoscroll="false"/>',
                    abstract: true
                })
                // -- MEAL ITEMS --
                .state("restricted.subscriptions.list", {
                    url: "/list",
                    templateUrl: 'app/components/subscriptions/subscriptions_listView.html',
                    controller: 'subscriptions_listCtrl',
                    resolve: {
                        subscriptions_data: function(Subscription){
                            return Subscription.find({}).$promise
                            .then(function (data) {
                              return data;
                          });
                        },
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_pagination',
                                'app/components/subscriptions/subscriptions_listController.js'
                            ], { serie: true } );
                        }]
                    },
                    data: {
                        pageTitle: 'Meal Items'
                    }
                })
                // == NUTRITIONIST --
                .state("restricted.nutritionist", {
                    url: "/nutritionist",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    abstract: true
                })
                // CUSTOMERS VITALS
                .state("restricted.nutritionist.customers_vitals", {
                    url: "/customers_vitals",
                    templateUrl: 'app/components/nutritionist/customers_vitalsView.html',
                    controller: 'customers_vitalsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/nutritionist/customers_vitalsController.js'
                            ],{serie: true});
                        }],
                        user_list: function(User){
                            return User.find({}).$promise.then(function (data) {
                                return data;
                            });
                        }
                    },
                    data: {
                        pageTitle: 'Customers Vitals'
                    }
                })
                // == REPORTS --
                .state("restricted.reports", {
                    url: "/reports",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }"/>',
                    abstract: true,
                    ncyBreadcrumb: {
                        label: 'Reports'
                    }
                })
                .state("restricted.reports.production", {
                    url: "/production",
                    templateUrl: 'app/components/reports/productionView.html',
                    controller: 'productionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/reports/productionController.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Production Assistance'
                    }
                })
                .state("restricted.reports.deliveries", {
                    url: "/deliveries",
                    templateUrl: 'app/components/reports/deliveriesView.html',
                    controller: 'deliveriesCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/reports/deliveriesController.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Delivery List'
                    }
                })
                .state("restricted.reports.receipts", {
                    url: "/receipts",
                    templateUrl: 'app/components/reports/receiptsView.html',
                    controller: 'receiptsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/reports/receiptsController.js'
                            ],{serie: true});
                        }]
                    },
                    data: {
                        pageTitle: 'Receipts'
                    }
                })

            // -- PAGES --
                .state("restricted.pages", {
                    url: "/pages",
                    template: '<div ui-view autoscroll="false" ng-class="{ \'uk-height-1-1\': page_full_height }" />',
                    abstract: true
                })

                .state("restricted.pages.scrum_board", {
                    url: "/scrum_board",
                    templateUrl: 'app/components/pages/scrum_boardView.html',
                    controller: 'scrum_boardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_dragula',
                                'app/components/pages/scrum_boardController.js'
                            ],{serie: true});
                        }],
                        tasks_list: function($http){
                            return $http({ method: 'GET', url: 'data/tasks_list.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
                    },
                    data: {
                        pageTitle: 'Scrum Board'
                    }
                })

                .state("restricted.pages.user_profile", {
                    url: "/user_profile",
                    templateUrl: 'app/components/pages/user_profileView.html',
                    controller: 'user_profileCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'app/components/pages/user_profileController.js'
                            ]);
                        }],
                        user_data: function (User) {
                            return User.getCurrent().$promise
                              .then(function (data) {
                                return data;
                              });
                        }
                    },
                    data: {
                        pageTitle: 'User profile'
                    }
                })
                .state("restricted.pages.user_edit", {
                    url: "/user_edit",
                    templateUrl: 'app/components/pages/user_editView.html',
                    controller: 'user_editCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'assets/js/custom/uikit_fileinput.min.js',
                                'app/components/pages/user_editController.js'
                            ],{serie: true});
                        }],
                        user_data: function (User) {
                            var user = User.getCachedCurrent();
                            if(user !== null){
                              return user;
                            } else {
                              return User.getCurrent().$promise.then(function (data) {
                                return data;
                              });
                            }
                        }
                    },
                    data: {
                        pageTitle: 'User edit'
                    }
                })
        }
    ]);
