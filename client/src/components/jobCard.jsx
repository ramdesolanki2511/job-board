const JobCard = ({ job, onApply }) => {
  return (
    <div className="bg-white shadow rounded-xl p-4 mb-4 border">
      <h2 className="text-xl font-semibold">{job.title}</h2>
      <p className="text-gray-600">
        {job.company} — {job.location}
      </p>
      <p className="mt-2">{job.description}</p>
      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onApply(job._id)}
        disabled={job.applied}
      >
        {job.applied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
};

export default JobCard;
