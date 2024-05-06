import { createRouter, createWebHistory } from "vue-router";
import { Token } from "@/services/Token";
import usePostMessage from "@/composables/usePostMessage";
import ChatList from "@/chat/views/ChatList.vue";
import ChatBox from "@/chat/views/ChatBox.vue";
import SpepVideoChat from "@/chat/views/AgoraRtcRtm.vue";
const { onPostMessageFire } = usePostMessage();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // =========== *** Login *** ===========
    {
      path: "/login",
      name: "Login",
      component: () => import("@/pages/Login.vue"),
      meta: {
        disabledAurth: true,
      },
    },
    // =========== *** Find Password *** ===========
    {
      path: "/find-password",
      name: "find-password",
      component: () => import("@/pages/FindPassword.vue"),
      meta: {
        disabledAurth: true,
      },
    },

    

    // ====================== **** View Pages Only **** =====================
    {
      path: "/",
      name: "teacher",
      component: () => import("@/components/layout/PageLayout.vue"),
      redirect: { name: "TeacherClass" },
      requiresAuth: true,
      children: [
        // ================================= @@@@@@ MY CLASS :: START @@@@@@ ====================================
        // ================================= @@@@@@ MY CLASS :: START @@@@@@ =====================================

        //  ============== ***** Today's Class ***** ===============
        {
          path: "/todays-class",
          name: "TeacherClass",
          component: () =>
            import("@/views/MyClass/TodaysClass/TeacherClassView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "TeacherClass",
              },
            ],
          },
        },
        //  ============== ***** Class Feedback ***** ===============
        {
          path: "/my-class-feedback/:date/:class_seq/:course_seq/:schedule_seq",
          name: "MyClassFeedback",
          component: () =>
            import("@/views/MyClass/TodaysClass/Feedback/FeedbackView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Content & Feedback",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "",
              },
              {
                text: "Today's Content & Feedback",
                to: "MyClassFeedback",
              },
            ],
          },
        },
        //  ============== ***** Class Feedback LPE ***** ===============
        {
          path: "/feedback-lpe/:date/:class_seq/:course_seq/:schedule_seq",
          name: "FeedbackLPE",
          component: () =>
            import("@/views/MyClass/TodaysClass/Feedback/FeedbackView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Content & Feedback",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "",
              },
              {
                text: "Today's Content & Feedback",
                to: "FeedbackLPE",
              },
            ],
          },
        },
        //  ============== ***** Class Feedback Assessment ***** ===============
        {
          path: "/feedback-assessment/:date/:class_seq/:course_seq/:schedule_seq",
          name: "FeedbackAssessment",
          component: () =>
            import("@/views/MyClass/TodaysClass/Feedback/FeedbackView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Content & Feedback",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "",
              },
              {
                text: "Today's Content & Feedback",
                to: "FeedbackAssessment",
              },
            ],
          },
        },
        //  ============== ***** Class Feedback Lecture ***** ===============
        {
          path: "/feedback-lecture/:date/:class_seq/:course_seq/:schedule_seq",
          name: "FeedbackLecture",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/Feedback/FeedbackView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "",
              },
              {
                text: "Today's Content & Feedback",
                to: "FeedbackLecture",
              },
            ],
          },
        },

        //  ============== ***** Class Details Information ***** ===============
        {
          path: "/class-details-attendance/:date/:class_seq/:course_seq/:schedule_seq",
          name: "ClassDetailsAttendance",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/ClassDetails/ClassDetailsView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "ClassDetailsAttendance",
              },
            ],
          },
        },

        //  ============== ***** Class Details Feedback !!! [Not Used] ***** ===============
        {
          path: "/class-details-feedback/:date/:class_seq/:course_seq/:schedule_seq",
          name: "ClassDetailsFeedback",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/ClassDetails/ClassDetailsView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Class Details Feedback",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "TeacherClass",
              },
            ],
          },
        },
        //  ============== ***** Class Details Lecture ***** ===============
        {
          path: "/class-detail-lecture/:date/:class_seq/:course_seq/:schedule_seq",
          name: "ClassDetailLecture",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/ClassDetails/ClassDetailsView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "ClassDetailLecture",
              },
            ],
          },
        },
        //  ============== ***** Class Details Active Learning Prep ***** ===============
        {
          path: "/class-detail-active-learning/:date/:class_seq/:course_seq/:schedule_seq",
          name: "ClassDetailsActiveLearningPrep",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/ClassDetails/ClassDetailsView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "ClassDetailsActiveLearningPrep",
              },
            ],
          },
        },
        //  ============== ***** Class Details Listing Lab ***** ===============
        {
          path: "/class-details-listening-lab/:date/:class_seq/:course_seq/:schedule_seq",
          name: "ClassDetailsListeningLab",
          component: () =>
            import(
              "@/views/MyClass/TodaysClass/ClassDetails/ClassDetailsView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Today's Class",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Today's Class",
                to: "ClassDetailsListeningLab",
              },
            ],
          },
        },
        //  ============= ** Check List ** ============
        {
          path: "/check-list",
          name: "CheckList",
          component: () =>
            import("@/views/MyClass/CheckList/CheckListView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Check List",
            breadcrumb: [
              {
                text: "My Data",
              },
              {
                text: "Check List",
                to: "CheckList",
              },
            ],
          },
        },
        //  ============= ** Check List Details Page** ============
        {
          path: "/check-list-detail-view",
          redirect: { name: "CheckListDetailFeedback" },
          children: [
            {
              path: "feedback", 
              name: "CheckListDetailFeedback",
              component: () => import("@/views/MyClass/CheckList/CheckListDetailView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "Check List",
                mobileHeaderTitle: "Feedback",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Check List",
                    to: "CheckList",
                  },
                  {
                    text: "Feedback",
                    to: "CheckListDetailFeedback",
                  },
                ],
              },
            },
            {
              path: "assessment", 
              name: "CheckListDetailAssessment",
              component: () => import("@/views/MyClass/CheckList/CheckListDetailView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "Check List",
                mobileHeaderTitle: "Assessment",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Check List",
                    to: "CheckList",
                  },
                  {
                    text: "Assessment",
                    to: "CheckListDetailAssessment",
                  },
                ],
              },
            },
            {
              path: "attendance", 
              name: "CheckListDetailAttendance",
              component: () => import("@/views/MyClass/CheckList/CheckListDetailView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "Check List",
                mobileHeaderTitle: "Attendance",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Check List",
                    to: "CheckList",
                  },
                  {
                    text: "Attendance",
                    to: "CheckListDetailAttendance",
                  },
                ],
              },
            },
            {
              path: "lpe", 
              name: "CheckListDetailLpe",
              component: () => import("@/views/MyClass/CheckList/CheckListDetailView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "Check List",
                mobileHeaderTitle: "LPE",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Check List",
                    to: "CheckList",
                  },
                  {
                    text: "LPE",
                    to: "CheckListDetailLpe",
                  },
                ],
              },
            }
          ]
        },

        //  ============= ** All Data ** ============
        {
          path: "/all-data",
          redirect: { name: "AllDataFeedback" },
          children: [
            {
              path: "feedback",
              name: "AllDataFeedback",
              component: () =>
                import("@/views/MyClass/AllData/AllDataView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "All Data",
                breadcrumb: [
                  {
                    text: "My Class",
                  },
                  {
                    text: "All Data",
                    to: "AllDataFeedback",
                  },
                ],
              },
            },
            {
              path: "lpe",
              name: "AllDataLPE",
              component: () =>
                import("@/views/MyClass/AllData/AllDataView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "All Data",
                breadcrumb: [
                  {
                    text: "My Class",
                  },
                  {
                    text: "All Data",
                    to: "AllDataLPE",
                  },
                ],
              },
            },
            {
              path: "assessment",
              name: "AllDataAssessment",
              component: () =>
                import("@/views/MyClass/AllData/AllDataView.vue"),
              meta: {
                requiresAuth: true,
                headerTitle: "All Data",
                breadcrumb: [
                  {
                    text: "My Class",
                  },
                  {
                    text: "All Data",
                    to: "AllDataAssessment",
                  },
                ],
              },
            },
          ],
        },

        // ======== **Weekly Schedule** =======
        {
          path: "/my-class-weekly-schedule",
          name: "MyClassWeeklySchedule",
          component: () =>
            import(
              "@/views/MyClass/WeeklySchedule/MyClassWeeklyScheduleView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Weekly Schedule",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "Weekly Schedule",
                to: "MyClassWeeklySchedule",
              },
            ],
          },
        },

        // ================================= ###### MY CLASS :: START ###### ====================================
        // ================================= ###### MY CLASS :: START ###### =====================================

        // --------------------------------------------------- x --------------------------------------------------------

        {
          path: "/MyClass-Feedback-Table-two",
          name: "MyClassFeedbackTabletwo",
          component: () => import("@/views/MyClassFeedbackTabletwo.vue"),
          meta: {
            type: "teacher",
            requiresAuth: true,
          },
        },

        // =================================  ###### MY PERFORMANCE & DEVELOPMENT :: END ###### ====================================
        // =================================  ###### MY PERFORMANCE & DEVELOPMENT :: END ###### =====================================

        //  ============= ** Survey Results ** ============
        {
          path: "/survey-results",
          name: "SurveyResuts",
          redirect: { name: "SurveyResultsSurvey" },
          children: [
            //  ============= ** Survey ** ============
            {
              path: "survey",
              name: "SurveyResultsSurvey",
              component: () =>
                import(
                  "@/views/MyPerformance&Development/SurveyResult/SurveyResultsView.vue"
                ),
              meta: {
                requiresAuth: true,
                headerTitle: "Survey Results",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Survey Results",
                    to: "SurveyResultsSurvey",
                  },
                ],
              },
            },

            //  ============= ** Feedback** ============
            {
              path: "feedback",
              name: "SurveyResultsFeedback",
              component: () =>
                import(
                  "@/views/MyPerformance&Development/SurveyResult/SurveyResultsView.vue"
                ),
              meta: {
                requiresAuth: true,
                headerTitle: "Survey Results",
                breadcrumb: [
                  {
                    text: "My Data",
                  },
                  {
                    text: "Survey Results",
                    to: "SurveyResultsFeedback",
                  },
                ],
              },
            },
          ],
        },
        //  ============= ** My Class Video ** ============
        {
          path: "my-class-video",
          name: "MyClassVideo",
          component: () =>
            import(
              "@/views/MyPerformance&Development/MyClassVideos/MyClassVideosView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "My Class Videos",
            breadcrumb: [
              {
                text: "My Class",
              },
              {
                text: "My Class Videos",
                to: "MyClassVideo",
              },
            ],
          },
        },

        //  ============== ***** Best Class ***** ===============
        {
          path: "/best-class",
          name: "BestClass",
          component: () =>
            import(
              "@/views/MyPerformance&Development/BestClassParticipant/BestClassParticipantView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Best Class & Participant History",
            breadcrumb: [
              {
                text: "My Data",
              },
              {
                text: "Best Class & Participant History",
                to: "BestClass",
              },
            ],
          },
        },
        //  ============== ***** Best Participant ***** ===============
        {
          path: "/best-participant",
          name: "BestParticipant",
          component: () =>
            import(
              "@/views/MyPerformance&Development/BestClassParticipant/BestClassParticipantView.vue"
            ),
          meta: {
            requiresAuth: true,
            headerTitle: "Best Class & Participant History",
            breadcrumb: [
              {
                text: "My Data",
              },
              {
                text: "Best Class & Participant History",
                to: "BestParticipant",
              },
            ],
          },
        },
        // ======== **Training Library** =======
        {
          path: "/training-library",
          name: "TrainingLibrary",
          component: () =>
            import(
              "@/views/MyPerformance&Development/TrainingLibrary/TrainingLibraryView.vue"
            ),
          meta: {
            type: "component",
            requiresAuth: true,
            headerTitle: "Training Library",
            breadcrumb: [
              {
                text: "My Data",
              },
              {
                text: "Training Library",
                to: "TrainingLibrary",
              },
            ],
          },
        },

        // ================================= ###### MY PERFORMANCE & DEVELOPMENT :: END ###### ====================================
        // ================================= ###### MY PERFORMANCE & DEVELOPMENT :: END ###### =====================================

        // --------------------------------------------------- x --------------------------------------------------------

        // ================================= @@@@@@ MY ADMIN :: START @@@@@@ ====================================
        // ================================= @@@@@@ MY ADMIN :: START @@@@@@ =====================================

        // ======== **My Info** =======
        {
          path: "/my-info",
          name: "MyInfo",
          component: () => import("@/views/MyAdmin/MyInfoView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "My Info",
            breadcrumb: [
              {
                text: "My Admin",
              },
              {
                text: "My Info",
                to: "MyInfo",
              },
            ],
          },
        },
        //  ========== ** Material Management ** ==========
        {
          path: "/material-management",
          name: "MaterialManagement",
          component: () => import("@/views/MyAdmin/MaterialManagementView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Material Management",
            breadcrumb: [
              {
                text: "My Admin",
              },
              {
                text: "Material Management",
                to: "MaterialManagement",
              },
            ],
          },
        },
        // deepgram 
        {
          path: "/deep-gram",
          name: "Deepgram",
          component: () => import("@/views/DeepGram/MainPage.vue"),
        },

        // ======== **Payroll** =======
        {
          path: "/payroll",
          name: "Payroll",
          component: () => import("@/views/MyAdmin/PayrollView.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Payroll",
            breadcrumb: [
              {
                text: "My Admin",
              },
              {
                text: "Payroll",
                to: "Payroll",
              },
            ],
          },
        },

        // ================================= ###### MY ADMIN :: END ###### ====================================
        // ================================= ###### MY ADMIN :: END ###### =====================================

        // ------------------------------------------------- x -------------------------------------------------------------

        // ================================= ###### MESSAGE :: START ###### ====================================
        // ================================= ###### MESSAGE :: START ###### =====================================

        // ======== **Notice** =======
        {
          path: "/notice",
          name: "Notice",
          component: () => import("@/views/Message/Notice/Notice.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "Notice",
            breadcrumb: [
              {
                text: "Message",
              },
              {
                text: "Notice",
                to: "Notice",
              },
            ],
          },
        },
        // ======== **1:1Message** =======
        {
          path: "/one-message",
          name: "OneMessage",
          component: () => import("@/views/Message/OneMessage/OneMessage.vue"),
          meta: {
            requiresAuth: true,
            headerTitle: "1:1 message",
            breadcrumb: [
              {
                text: "Message",
              },
              {
                text: "1:1 message",
                to: "OneMessage",
              },
            ],
          },
        },
        {
          path: "/write-message",
          name: "WriteMessage",
          component: () =>
            import("@/views/Message/OneMessage/WriteMessage.vue"),
          meta: {
            type: "component",
            headerTitle: "1:1 message",
            requiresAuth: true,
          },
        },
        {
          path: "/message-user-details",
          name: "MessageUserDetails",
          component: () =>
            import("@/views/Message/OneMessage/MessageUserDetails.vue"),
            meta: {
              requiresAuth: true,
              headerTitle: "1:1 message",
              breadcrumb: [
                {
                  text: "Message",
                },
                {
                  text: "1:1 message",
                  to: "OneMessage",
                },
              ],
            },
        },
        {
          path: "/message-details-imageupload",
          name: "messagedetailsimageupload",
          component: () =>
            import("@/views/Message/OneMessage/MessageDetailsImageUpload.vue"),
            meta: {
              requiresAuth: true,
              headerTitle: "1:1 message",
              breadcrumb: [
                {
                  text: "Message",
                },
                {
                  text: "1:1 message",
                  to: "OneMessage",
                },
              ],
            },
        },

        {
          path: "/chat/:room_name/:member/:session/:year/:id",
          name: "ChatBox",
          component: ChatBox,
          meta: {
            requiresAuth: true,
            headerTitle: "Message",
            breadcrumb: [
              {
                text: "Message",
              },
              {
                text: "Message",
                to: "ChatBox",
              },
            ],
          },
        },
        
        {
          path: "/chat-list",
          name: "ChatList",
          component: ChatList,
          meta: {
            requiresAuth: true,
            headerTitle: "Message",
            breadcrumb: [
              {
                text: "Message",
              },
              {
                text: "Message",
                to: "ChatListing",
              },
            ],
          },
        },
        {
          path: "/spep-video-chat/:host_type/:room_name/:room_id/:call_type?",
          name: "SpepVideoChat",
          component: SpepVideoChat,
          meta: {
            requiresAuth: true,
            headerTitle: "Message",
          },
        },
        

        // {
        //   path: "/settings-modal",
        //   name: "SettingsModal",
        //   component: () => import("@/views/settings/SettingsModal.vue"),
        // },

        {
          path: "/incoming-dialog-box",
          name: "InComingDialogBox",
          component: () => import("@/components/modal/InComingDialogBox.vue"),
        },


        {
          path: "/terms-of-use",
          name: "TermsOfUse",
          component: () => import("@/views/Settings/TermsOfUse.vue"),
          meta: {
            headerTitle: "Terms Of Use",
            breadcrumb: [
              {
                text: "Settings",
              },
              {
                text: "Terms Of Use",
                to: "TermsOfUse",
              },
            ],
          },
        },
        {
          path: "/privacy-policy",
          name: "PrivacyPolicy",
          component: () => import("@/views/Settings/PrivacyPolicy.vue"),
          meta: {
            headerTitle: "Privacy Policy",
            breadcrumb: [
              {
                text: "Settings",
              },
              {
                text: "Privacy Policy",
                to: "PrivacyPolicy",
              },
            ],
          },
        },

      ],
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      redirect: "/",
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

// Route guard
router.beforeEach(async (to, from, next) => {
  const tokenUtil = new Token();
  try {
    const { token } = await tokenUtil.getWithExpiry("accessTokenT");
    if (token) {
      if (to.meta.disabledAurth) {
        return next({ name: "TeacherClass" });
      }
    }
    if (to.meta.requiresAuth && !token) {
      tokenUtil.remove("accessTokenT");
      tokenUtil.remove("refreshTokenT");
      next({ name: "Login" });
      onPostMessageFire("logout");
    } else next();
  } catch (error) {
    next({ name: "Login" });
    return;
  }
});

export default router;
