import { useEffect, useState } from "react";
import { API, fetchRemoteOKJobs } from "./services/api";
import JobCard from "./components/jobCard";
import Tab from "./components/Tabs";

function App() {
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('all')

  const getJobs = async () => {
    const endPoint = activeTab === 'applied' ? '/jobs/applied' : '/jobs';

    try {
      const res = await API.get(endPoint)
      setJobs(res.data)
    } catch (error) {
      console.error("Error fatching job:", error)
    }
  }

  useEffect(() => {
    getJobs()
  }, [activeTab]);

  const handleApply = async (jobId) => {
    try {
      const res = await API.post("/jobs/apply", { jobId });
      const updatedJob = res.data.job;

      setJobs((prevJob) =>
        prevJob.map((job) => (job._id === jobId ? updatedJob : job))
      );
    } catch (error) {
      console.log("Apply error:", error.response?.data || error.message);
    }
  };

  const handleScrape = async () => {
    const res = await fetchRemoteOKJobs()
    getJobs()
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-6">Job Dashboard</h1>
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        {jobs.length === 0 && <p>No job to show.</p>}
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} onApply={handleApply} />
        ))}
        <button onClick={handleScrape} className="btn btn-primary">Scrape RemoteOK Jobs</button>
      </div>
    </>
  );
}

export default App;