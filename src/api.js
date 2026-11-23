const API_URL = "http://localhost:5000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function checkBackend() {
  try {
    return await request("/api/status");
  } catch (error) {
    console.error("Backend error:", error);
    return {
      success: false,
      message: "Backend connection failed"
    };
  }
}

export const getProblems = () =>
  request("/api/problems");

export const addProblem = (problem) =>
  request("/api/problems", {
    method: "POST",
    body: JSON.stringify({
      title: problem.name || problem.title,
      topic: problem.topic,
      difficulty: problem.difficulty,
      solved: problem.solved || false
    })
  });

export const updateProblem = (id, data) =>
  request(`/api/problems/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteProblem = (id) =>
  request(`/api/problems/${id}`, {
    method: "DELETE"
  });

export const getTasks = () =>
  request("/api/planner/tasks");

export const saveTask = (task) =>
  request("/api/planner/tasks", {
    method: "POST",
    body: JSON.stringify(task)
  });

export const updateTask = (id, data) =>
  request(`/api/planner/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const getMistakes = () =>
  request("/api/planner/mistakes");

export const saveMistake = (mistake) =>
  request("/api/planner/mistakes", {
    method: "POST",
    body: JSON.stringify(mistake)
  });

export const updateMistake = (id, data) =>
  request(`/api/planner/mistakes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const getInterviews = () =>
  request("/api/interviews");

export const saveInterview = (interview) =>
  request("/api/interviews", {
    method: "POST",
    body: JSON.stringify(interview)
  });