const Tab = ({ activeTab, setActiveTab}) => {
    return (
        <div className="flex space-x-4 mb-6">
            <button
                className={`px-4 py-2 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('all')}
            >
                All Jobs
            </button>
            <button
                className={`px-4 py-2 rounded ${activeTab === 'applied' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('applied')}
            >
                Applied Jobs
            </button>
        </div>
    )
}

export default Tab;