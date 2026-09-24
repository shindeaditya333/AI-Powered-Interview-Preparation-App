import {
    UserCircle,
    ShieldCheck,
} from "lucide-react";

import useAuth from "../hooks/useAuth";

export default function Profile() {

    const {
        username,
    } = useAuth();


    return (
        <div>

            <div className="page-header">

                <p className="eyebrow">
                    ACCOUNT
                </p>

                <h1>
                    Profile
                </h1>

                <p>
                    Manage your interview
                    preparation account.
                </p>

            </div>


            <div className="profile-card">

                <div className="profile-avatar">
                    <UserCircle size={50} />
                </div>


                <div className="profile-info">

                    <h2>
                        {username}
                    </h2>

                    <p>
                        Interview Preparation
                        Account
                    </p>

                </div>


                <div className="profile-status">

                    <ShieldCheck size={18} />

                    Account Active

                </div>

            </div>

        </div>
    );
}