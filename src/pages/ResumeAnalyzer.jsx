
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatch, setJobMatch] = useState(null);
  const [error, setError] = useState("");

  const skillsList = [
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "SQL",
    "MongoDB",
    "Machine Learning",
    "Data Structures",
    "Algorithms",
    "Express.js",
    "Git",
    "GitHub",
    "MySQL",
    "Angular",
    "TypeScript",
    "Problem Solving"
  ];

  const actionWords = [
    "developed",
    "created",
    "designed",
    "implemented",
    "built",
    "managed",
    "improved",
    "analyzed",
    "achieved",
    "optimized",
    "completed",
    "tested",
    "maintained",
    "automated",
    "integrated"
  ];

  const handleFile = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setError("");
    setAnalysis(null);
    setJobMatch(null);
    setResumeText("");
    setFile(null);

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const buffer = await selectedFile.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer)
      }).promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        extractedText +=
          content.items
            .map((item) => item.str)
            .join(" ") + " ";
      }

      extractedText = extractedText.trim();

      if (!extractedText) {
        throw new Error(
          "No readable text found. Please upload a text-based PDF."
        );
      }

      setResumeText(extractedText);
    } catch (error) {
      console.error(error);
      setFile(null);
      setError(
        error.message ||
          "Unable to read this PDF. Please try another file."
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const analyzeResume = () => {
    if (!resumeText) {
      setError("Please upload a readable PDF first.");
      return;
    }

    setError("");
    setJobMatch(null);

    const text = resumeText.toLowerCase();
    const wordCount = resumeText.trim().split(/\s+/).length;

    const detectedSkills = skillsList.filter((skill) =>
      text.includes(skill.toLowerCase())
    );

    const sections = [
      {
        name: "Education",
        found: /education|qualification|academic/i.test(text)
      },
      {
        name: "Technical Skills",
        found: /skills|technical skills|technologies/i.test(text)
      },
      {
        name: "Projects",
        found: /projects|project experience/i.test(text)
      },
      {
        name: "Experience",
        found: /experience|internship|work history/i.test(text)
      },
      {
        name: "Contact Details",
        found: /email|phone|contact|linkedin|github/i.test(text)
      }
    ];

    const completedSections = sections.filter(
      (section) => section.found
    ).length;

    const skillScore = Math.min(
      detectedSkills.length * 3,
      30
    );

    const lengthScore =
      wordCount >= 150 && wordCount <= 800 ? 10 : 5;

    const detectedActionWords = actionWords.filter((word) =>
      text.includes(word)
    );

    const actionScore = Math.min(
      detectedActionWords.length * 2,
      10
    );

    const sectionScore = completedSections * 10;

    const totalScore = Math.min(
      sectionScore + skillScore + lengthScore + actionScore,
      100
    );

    const breakdown = [
      {
        name: "Section Completion",
        score: sectionScore,
        total: 50
      },
      {
        name: "Technical Skills",
        score: skillScore,
        total: 30
      },
      {
        name: "Resume Length",
        score: lengthScore,
        total: 10
      },
      {
        name: "Action Words",
        score: actionScore,
        total: 10
      }
    ];

    const suggestions = [];

    if (!sections[0].found) {
      suggestions.push(
        "Add a clear Education section with your degree and institution."
      );
    }

    if (!sections[1].found) {
      suggestions.push(
        "Add a dedicated Technical Skills section."
      );
    }

    if (!sections[2].found) {
      suggestions.push(
        "Include academic or personal projects with technologies used."
      );
    }

    if (!sections[3].found) {
      suggestions.push(
        "Include internships, volunteering, or relevant experience if available."
      );
    }

    if (!sections[4].found) {
      suggestions.push(
        "Add professional contact details and relevant profile links."
      );
    }

    if (detectedSkills.length < 5) {
      suggestions.push(
        "Include more relevant technical skills that you genuinely know."
      );
    }

    if (actionScore < 6) {
      suggestions.push(
        "Use action words such as Developed, Designed, Implemented and Improved to explain your contributions."
      );
    }

    if (wordCount < 150) {
      suggestions.push(
        "Add more relevant details about your education, skills and projects."
      );
    }

    if (wordCount > 800) {
      suggestions.push(
        "Consider making your resume more concise by removing unnecessary information."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Good work! Review your resume for spelling, clarity and consistent formatting."
      );
    }

    setAnalysis({
      wordCount,
      detectedSkills,
      sections,
      completedSections,
      skillScore,
      totalScore,
      breakdown,
      suggestions,
      detectedActionWords
    });
  };

  const matchJobDescription = () => {
    if (!resumeText) {
      setError("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }

    setError("");

    const jobText = jobDescription.toLowerCase();

    const requiredSkills = skillsList.filter((skill) =>
      jobText.includes(skill.toLowerCase())
    );

    if (requiredSkills.length === 0) {
      setJobMatch(null);
      setError(
        "No supported technical skills were detected in the job description."
      );
      return;
    }

    const resumeLower = resumeText.toLowerCase();

    const matchedSkills = requiredSkills.filter((skill) =>
      resumeLower.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    const percentage = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    setJobMatch({
      requiredSkills,
      matchedSkills,
      missingSkills,
      percentage
    });
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResumeText("");
    setAnalysis(null);
    setJobDescription("");
    setJobMatch(null);
    setError("");
  };

  const downloadReport = () => {
    if (!analysis) return;

    const jobReport = jobMatch
      ? `
JOB DESCRIPTION MATCH

Job Match: ${jobMatch.percentage}%

Required Skills:
${jobMatch.requiredSkills.join(", ")}

Matched Skills:
${jobMatch.matchedSkills.join(", ") || "None"}

Missing Skills:
${jobMatch.missingSkills.join(", ") || "None"}
`
      : "\nNo job description comparison performed.";

    const report = `
PREPPILOT AI - RESUME ANALYSIS REPORT

Resume: ${file?.name || "Resume"}

RESUME SCORE: ${analysis.totalScore}/100

OVERVIEW
Words detected: ${analysis.wordCount}
Sections completed: ${analysis.completedSections}/5
Action words detected: ${analysis.detectedActionWords.length}

SCORE BREAKDOWN
${analysis.breakdown
  .map((item) => `${item.name}: ${item.score}/${item.total}`)
  .join("\n")}

TECHNICAL SKILLS
${analysis.detectedSkills.join(", ") || "No skills detected"}

RESUME CHECKLIST
${analysis.sections
  .map(
    (item) =>
      `${item.found ? "Completed" : "Missing"}: ${item.name}`
  )
  .join("\n")}

ACTION WORDS
${analysis.detectedActionWords.join(", ") || "None detected"}

IMPROVEMENT SUGGESTIONS
${analysis.suggestions.map((item) => "- " + item).join("\n")}

${jobReport}

Note: This is a basic rule-based estimate, not a real ATS score.
`;

    const blob = new Blob([report], {
      type: "text/plain"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "PrepPilot-Resume-Report.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Strong Resume Structure";
    if (score >= 60) return "Good Progress";
    if (score >= 40) return "Needs Improvement";
    return "Keep Building Your Resume";
  };

  return (
    <div>
      <p className="eyebrow">CAREER PREPARATION</p>

      <h1 className="page-heading">Resume Analyzer</h1>

      <p>
        Analyze your resume, identify missing sections and compare
        your skills with job requirements.
      </p>

      {error && (
        <div
          className="content-card"
          style={{
            marginTop: "20px",
            color: "#f87171",
            border: "1px solid #ef4444"
          }}
        >
          {error}
        </div>
      )}

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Upload Resume</h2>

        <p>
          Upload your resume in PDF format. Maximum file size: 10 MB.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFile}
        />

        {file && (
          <p style={{ marginTop: "12px" }}>
            Selected: {file.name}
          </p>
        )}

        {loading && (
          <p style={{ color: "#f59e0b" }}>
            Reading your PDF...
          </p>
        )}

        {resumeText && !loading && (
          <p style={{ color: "#22c55e" }}>
            ✓ PDF text extracted successfully.
          </p>
        )}

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px"
          }}
        >
          <button
            className="primary-btn"
            onClick={analyzeResume}
            disabled={!resumeText || loading}
          >
            Analyze Resume
          </button>

          <button
            className="primary-btn"
            onClick={resetAnalyzer}
            disabled={!file && !resumeText && !analysis}
            style={{
              background: "#555"
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Job Description Matcher</h2>

        <p>
          Compare the technical skills mentioned in a job
          description with the skills detected in your resume.
        </p>

        <textarea
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setJobMatch(null);
          }}
          placeholder="Paste the job description here..."
          rows={7}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            background: "#1a1a1a",
            color: "white",
            border: "1px solid #444",
            marginBottom: "15px",
            resize: "vertical"
          }}
        />

        <button
          className="primary-btn"
          onClick={matchJobDescription}
          disabled={!resumeText || loading}
        >
          Match Job Description
        </button>

        {jobMatch && (
          <div style={{ marginTop: "25px" }}>
            <hr />

            <h3>Job Match Score</h3>

            <h1
              style={{
                color: "#22c55e",
                fontSize: "42px"
              }}
            >
              {jobMatch.percentage}%
            </h1>

            <div
              style={{
                background: "#333",
                height: "10px",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${jobMatch.percentage}%`,
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: "10px"
                }}
              />
            </div>

            <p>
              Matched {jobMatch.matchedSkills.length} out of{" "}
              {jobMatch.requiredSkills.length} detected skills.
            </p>

            <h3>Matched Skills</h3>

            {jobMatch.matchedSkills.length > 0 ? (
              jobMatch.matchedSkills.map((skill) => (
                <p key={skill} style={{ color: "#22c55e" }}>
                  ✓ {skill}
                </p>
              ))
            ) : (
              <p>No matching skills detected.</p>
            )}

            <h3>Skills Not Detected</h3>

            {jobMatch.missingSkills.length > 0 ? (
              jobMatch.missingSkills.map((skill) => (
                <p key={skill} style={{ color: "#f59e0b" }}>
                  ○ {skill}
                </p>
              ))
            ) : (
              <p>All detected required skills are present!</p>
            )}

            <p style={{ color: "#999", fontSize: "13px" }}>
              This percentage compares detected keywords only.
              It does not measure actual skill proficiency.
            </p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="content-card" style={{ marginTop: "20px" }}>
          <h2>Resume Analysis</h2>

          <div style={{ margin: "25px 0" }}>
            <h3>Resume Score</h3>

            <div
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#22c55e"
              }}
            >
              {analysis.totalScore}/100
            </div>

            <h3>{getScoreLabel(analysis.totalScore)}</h3>

            <div
              style={{
                background: "#333",
                height: "12px",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${analysis.totalScore}%`,
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: "10px"
                }}
              />
            </div>

            <p>
              Estimated score based on detected resume content.
            </p>
          </div>

          <hr />

          <h3>Score Breakdown</h3>

          {analysis.breakdown.map((item) => (
            <div
              key={item.name}
              style={{ marginBottom: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "7px",
                  gap: "10px"
                }}
              >
                <strong>{item.name}</strong>
                <span>
                  {item.score}/{item.total}
                </span>
              </div>

              <div
                style={{
                  background: "#333",
                  height: "9px",
                  borderRadius: "10px",
                  overflow: "hidden"
                }}
              >
                <div
                  style={{
                    width: `${(item.score / item.total) * 100}%`,
                    height: "100%",
                    background: "#22c55e",
                    borderRadius: "10px"
                  }}
                />
              </div>
            </div>
          ))}

          <hr />

          <h3>Overview</h3>

          <p>Words detected: {analysis.wordCount}</p>

          <p>
            Sections completed: {analysis.completedSections}/5
          </p>

          <p>
            Technical skills points: {analysis.skillScore}/30
          </p>

          <p>
            Action words detected: {analysis.detectedActionWords.length}
          </p>

          <hr />

          <h3>Technical Skills Detected</h3>

          {analysis.detectedSkills.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              {analysis.detectedSkills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#263b30",
                    color: "#86efac",
                    padding: "7px 12px",
                    borderRadius: "6px"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>No technical skills detected.</p>
          )}

          <hr />

          <h3>Action Words Detected</h3>

          {analysis.detectedActionWords.length > 0 ? (
            <p>{analysis.detectedActionWords.join(", ")}</p>
          ) : (
            <p>No action words detected.</p>
          )}

          <hr />

          <h3>Resume Checklist</h3>

          {analysis.sections.map((section) => (
            <p key={section.name}>
              {section.found ? "✓" : "○"} {section.name}
            </p>
          ))}

          <hr />

          <h3>Improvement Suggestions</h3>

          {analysis.suggestions.map((suggestion, index) => (
            <p key={index}>
              {index + 1}. {suggestion}
            </p>
          ))}

          <button
            className="primary-btn"
            onClick={downloadReport}
            style={{ marginTop: "15px" }}
          >
            Download Analysis Report
          </button>

          <p
            style={{
              fontSize: "13px",
              color: "#999",
              marginTop: "15px"
            }}
          >
            This is a rule-based estimate, not a real ATS score
            or AI-generated assessment. Keyword detection cannot
            verify your actual skills.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
