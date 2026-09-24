export default function ProgressCard({
                                         current,
                                         total,
                                     }) {

    const percentage =
        total === 0
            ? 0
            : ((current + 1) / total) * 100;


    return (
        <div className="progress-card">

            <div className="progress-top">

                <span>
                    Question {current + 1}
                    {" "}of{" "}
                    {total}
                </span>

                <span>
                    {Math.round(percentage)}%
                </span>

            </div>


            <div className="progress-track">

                <div
                    className="progress-fill"
                    style={{
                        width: `${percentage}%`,
                    }}
                />

            </div>

        </div>
    );
}