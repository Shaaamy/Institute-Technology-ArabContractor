import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

// ─── Public Pages ────────────────────────────────────────────────────────────
const Home = lazy(() => import('../pages/Home'));
const Overview = lazy(() => import('../pages/overview'));
const Vision_goals = lazy(() => import('../pages/vision_and_goals/vision_goals'));
const News = lazy(() => import('../pages/News'));
const NewsDetails = lazy(() => import('../pages/newsDetails.jsx'));
const CoursesPage = lazy(() => import('../pages/CoursesPage'));
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const Library = lazy(() => import('../pages/Library'));
const CustomersPage = lazy(() => import('../pages/CustomersPage'));
const Certifications = lazy(() => import('../pages/Certifications'));
const Team = lazy(() => import('../pages/Team'));
const Instructors = lazy(() => import('../pages/Instructors'));
const FutureLeadersCouncil = lazy(() => import('../pages/Leaders'));
const Protocols = lazy(() => import('../pages/Protocols'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const Galery = lazy(() => import('../pages/Galary'));
const SearchPage = lazy(() => import('../pages/Searchpage'));

// ─── Training Pages ──────────────────────────────────────────────────────────
const VocationalTraining = lazy(() => import('../pages/VocationalTraining'));
const GesrElSuezPage = lazy(() => import('../pages/GesrElSuezPage'));
const ShobraTrainingPage = lazy(() => import('../pages/ShobraTrainingPage'));
const OnlineTrainingPage = lazy(() => import('../pages/OnlineTrainingPage'));
const TechnicalSchoolPage = lazy(() => import('../pages/TechnicalSchoolPage'));
const TechnicalEducation = lazy(() => import('../pages/TechnicalEducation'));
const TrainingMethods = lazy(() => import('../pages/TrainingMethods'));
const OnsiteTraining = lazy(() => import('../pages/OnsiteTraining_fixed'));
const CEAProgram = lazy(() => import('../pages/CEAProgram'));
const TestsSection = lazy(() => import('../pages/TestsSection'));

// ─── Cart / Checkout / Payment ───────────────────────────────────────────────
const ShoppingCartPage = lazy(() => import('../pages/ShoppingCartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const PaymentResultPage = lazy(() => import('../pages/Paymentresultpage.jsx'));
const Mycourses = lazy(() => import('../pages/Mycourses'));

// ─── Admin Pages ─────────────────────────────────────────────────────────────
const AdminDashboard = lazy(() => import('../pages/admin/Admin'));
const Mohadren = lazy(() => import('../pages/admin/mohadren'));
const NewsTab = lazy(() => import('../pages/admin/NewsTab'));
const BooksTab = lazy(() => import('../pages/admin/BooksTab'));
const PlanworkTab = lazy(() => import('../pages/admin/PlanworkTab'));

// ─── Loading Fallback ─────────────────────────────────────────────────────────
const PageLoader = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        fontSize: '1rem',
        color: '#888',
    }}>
        Loading...
    </div>
);

// ─── Routes ──────────────────────────────────────────────────────────────────
const AppRoutes = () => {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Routes>

                    {/* Public */}
                    <Route index element={<Home />} />
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/mission" element={<Vision_goals />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/news/:id" element={<NewsDetails />} />
                    <Route path="/courses/:slug" element={<CoursesPage />} />
                    <Route path="/course/:slug" element={<CourseDetails />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/certifications" element={<Certifications />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/instructors" element={<Instructors />} />
                    <Route path="/future-leaders" element={<FutureLeadersCouncil />} />
                    <Route path="/protocols" element={<Protocols />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/gallery" element={<Galery />} />
                    <Route path="/search" element={<SearchPage />} />

                    {/* Training */}
                    <Route path="/vocational-training" element={<VocationalTraining />} />
                    <Route path="/gesr-el-suez" element={<GesrElSuezPage />} />
                    <Route path="/shobra" element={<ShobraTrainingPage />} />
                    <Route path="/online-training" element={<OnlineTrainingPage />} />
                    <Route path="/Technical_Schools" element={<TechnicalSchoolPage />} />
                    <Route path="/technical-education" element={<TechnicalEducation />} />
                    <Route path="/training-methods" element={<TrainingMethods />} />
                    <Route path="/onsite-training" element={<OnsiteTraining />} />
                    <Route path="/cea-program" element={<CEAProgram />} />
                    <Route path="/tests" element={<TestsSection />} />

                    {/* Cart / Checkout / Payment */}
                    <Route path="/cart" element={<ShoppingCartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment/result" element={<PaymentResultPage />} />
                    <Route path="/my-courses" element={<Mycourses />} />

                    {/* Admin */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/mohadren" element={<Mohadren />} />
                    <Route path="/admin/news" element={<NewsTab />} />
                    <Route path="/admin/books" element={<BooksTab />} />
                    <Route path="/admin/planwork" element={<PlanworkTab />} />

                </Routes>
            </Suspense>
        </>
    );
};

export default AppRoutes;