import {
    CheckCircle2,
    Circle,
} from "lucide-react";

export default function QuestionCard({
                                         question,
                                         answer,
                                         setAnswer,
                                     }) {

    const isMCQ =
        question.type?.toUpperCase() === "MCQ";


    if (isMCQ) {

        const options = [
            {
                key: "A",
                value: question.optionA,
            },
            {
                key: "B",
                value: question.optionB,
            },
            {
                key: "C",
                value: question.optionC,
            },
            {
                key: "D",
                value: question.optionD,
            },
        ];


        return (
            <div className="question-card">

                <div className="question-meta">

                    <span className="question-type">
                        MCQ
                    </span>

                    <span>
                        {question.difficulty}
                    </span>

                </div>


                <h2>
                    {question.question}
                </h2>


                <div className="options">

                    {options.map(
                        (option) => (

                            <button
                                key={option.key}
                                type="button"
                                className={`option ${
                                    answer === option.key
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    setAnswer(
                                        answer === option.key
                                            ? ""
                                            : option.key
                                    )
                                }
                            >

                                <span className="option-letter">
                                    {option.key}
                                </span>

                                <span>
                                    {option.value}
                                </span>

                                {answer ===
                                option.key ? (
                                    <CheckCircle2
                                        size={20}
                                    />
                                ) : (
                                    <Circle
                                        size={20}
                                    />
                                )}

                            </button>

                        )
                    )}

                </div>

            </div>
        );
    }


    return (
        <div className="question-card">

            <div className="question-meta">

                <span className="question-type">
                    TEXT
                </span>

                <span>
                    {question.difficulty}
                </span>

            </div>


            <h2>
                {question.question}
            </h2>


            <textarea
                className="answer-textarea"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) =>
                    setAnswer(e.target.value)
                }
            />

        </div>
    );
}