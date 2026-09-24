import {
    createBrowserRouter,
    Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Domains from "../pages/Domains";
import MockInterview from "../pages/MockInterview";
import Results from "../pages/Results";
import Profile from "../pages/Profile";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import ProtectedRoute from "./ProtectedRoute";

import InterviewMode from "../pages/InterviewMode";
import AudioInterview from "../pages/AudioInterview";
import VideoInterview from "../pages/VideoInterview.jsx";

export const router =
    createBrowserRouter([
        {
            path: "/",
            element: <Home />,
        },

        {
            element: <AuthLayout />,
            children: [
                {
                    path: "/login",
                    element: <Login />,
                },
                {
                    path: "/register",
                    element: <Register />,
                },
            ],
        },

        {
            element: <ProtectedRoute />,
            children: [
                {
                    element: <MainLayout />,
                    children: [
                        {
                            path: "/dashboard",
                            element: <Dashboard />,
                        },
                        {
                            path: "/domains",
                            element: <Domains />,
                        },
                        {
                            path: "/interview-mode/:domainId",
                            element: <InterviewMode />,
                        },
                        {
                            path: "/audio-interview/:domainId",
                            element: <AudioInterview />,
                        },
                        {
                            path: "/mock-interview/:domainId",
                            element: <MockInterview />,
                        },
                        {
                            path: "/video-interview/:domainId",
                            element: <VideoInterview />,
                        },
                        {
                            path: "/results/:interviewId",
                            element: <Results />,
                        },
                        {
                            path: "/profile",
                            element: <Profile />,
                        },
                    ],
                },
            ],
        },

        {
            path: "*",
            element: (
                <Navigate
                    to="/"
                    replace
                />
            ),
        },
    ]);