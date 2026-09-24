import {
    useEffect,
    useState,
} from "react";

import {
    ArrowRight,
    BookOpen,
    Code2,
    Database,
    Globe,
    Layers,
    Server,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    getDomains,
} from "../services/domainService";

import LoadingSpinner from "../components/LoadingSpinner";


const icons = [
    Code2,
    Server,
    Globe,
    Database,
    Layers,
    BookOpen,
];


export default function Domains() {

    const navigate = useNavigate();

    const [domains, setDomains] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const loadDomains = async () => {

            try {

                const data =
                    await getDomains();

                setDomains(data);

            } catch (error) {

                toast.error(
                    "Unable to load domains"
                );

            } finally {

                setLoading(false);
            }
        };

        loadDomains();

    }, []);


    if (loading) {

        return (
            <LoadingSpinner
                text="Loading domains..."
            />
        );
    }


    return (
        <div>

            <div className="page-header">

                <div>

                    <p className="eyebrow">
                        PRACTICE
                    </p>

                    <h1>
                        Choose your domain
                    </h1>

                    <p>
                        Select a technical area
                        to begin your interview.
                    </p>

                </div>

            </div>


            {domains.length === 0 ? (

                <div className="empty-state">

                    <BookOpen size={40} />

                    <h3>
                        No domains available
                    </h3>

                    <p>
                        Add domains to your
                        database first.
                    </p>

                </div>

            ) : (

                <div className="domain-grid">

                    {domains.map(
                        (domain, index) => {

                            const Icon =
                                icons[
                                index %
                                icons.length
                                    ];

                            return (
                                <div
                                    className="domain-card"
                                    key={domain.id}
                                    onClick={() =>
                                        navigate(
                                            `/interview-mode/${domain.id}`
                                        )
                                    }
                                >

                                    <div className="domain-icon">
                                        <Icon size={25} />
                                    </div>

                                    <h3>
                                        {domain.name}
                                    </h3>

                                    <p>
                                        {domain.description ||
                                            "Practice interview questions and improve your skills."}
                                    </p>

                                    <div className="domain-link">
                                        Start Interview
                                        <ArrowRight
                                            size={17}
                                        />
                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>
            )}

        </div>
    );
}