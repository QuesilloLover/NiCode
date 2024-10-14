import { useState, useEffect } from "react";
import axios from 'axios';
import NiCode from '../assets/NiCode.svg';
import { Link } from 'react-router-dom';
import { HelpCircle, Clock, Tag, PlusCircle, ThumbsUp, MessageCircle, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forum() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [openAnswers, setOpenAnswers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [questions, setQuestions] = useState([]); 

  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  // Fetch the access token
  const accessToken = localStorage.getItem("accessToken");
  console.log("Access Token:", accessToken);

  const sidebarIcons = [
    { icon: HelpCircle, label: "Help"},
    { icon: Clock, label: "History"},
    { icon: Tag, label: "Tags"},
    { 
      icon: PlusCircle, 
      label: "Add Question", 
      onClick: () => setIsModalOpen(true) // Open the modal when the button is clicked
    },
  ];

  const toggleAnswers = (questionId) => {
    setOpenAnswers((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  useEffect(() => {
    // Fetch questions from API on component mount
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/forum/topics/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Ensure the auth token is present
          },
        });
        setQuestions(response.data); // Set the questions state with the fetched data
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [accessToken]);

  const filteredQuestions = questions.filter(
    (question) =>
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    if (tagInput.trim() && !newQuestion.tags.includes(tagInput.trim())) {
      setNewQuestion((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setNewQuestion((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New Question Submitted:", newQuestion);
    // Convert the tags to the required format
    const formattedTags = newQuestion.tags.map(tag => ({ name: tag }));
  
    try {
      const response = await axios.post(
        'http://localhost:8000/forum/topics/',
        { ...newQuestion, tags: formattedTags },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, 
            "Content-Type": "application/json", 
          }
        }
      );
  
      // Update the question section with the new question
      const questionsResponse = await axios.get('http://localhost:8000/forum/topics/');
      setQuestions(questionsResponse.data); 
  
    } catch (error) {
      console.error("Error submitting new question:", error);
    }
  
    setIsModalOpen(false);
    setNewQuestion({ title: "", description: "", tags: [] });
    setTagInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarExpanded ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between p-4">
          <span className={`font-semibold ${isSidebarExpanded ? "" : "hidden"}`}>Menu</span>
          <button onClick={toggleSidebar} className="p-2">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-4">
          {sidebarIcons.map(({ icon: Icon, label, onClick }) => (
            <button key={label} className="flex items-center space-x-2" onClick={onClick}>
              <Icon className="h-5 w-5" />
              <span className={isSidebarExpanded ? "" : "hidden"}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-3xl font-bold">Foro</h1>
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search questions..."
              className="pl-8 py-2 border rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-4 py-2"
          >
            <option value="recent">Most Recent</option>
            <option value="likes">Most Likes</option>
            <option value="answers">Most Answers</option>
          </select>
        </div>

        {/* Questions List */}
        <div className="overflow-y-auto h-[calc(100vh-220px)] space-y-4">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white shadow rounded p-4">
              <h2 className="text-lg font-semibold">{question.title}</h2>
              <p className="text-gray-600">{question.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                <span>{question.author} • {new Date(question.post_date).toLocaleDateString()}</span>
                <div className="flex space-x-4">
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1 h-4 w-4" /> {question.likes || 0}
                  </span>
                  <button onClick={() => toggleAnswers(question.id)} className="flex items-center">
                    <MessageCircle className="mr-1 h-4 w-4" /> {question.answers?.length || 0}
                  </button>
                </div>
              </div>

              {openAnswers.includes(question.id) && (
                <div className="mt-4 space-y-4">
                  {question.answers?.map((answer) => (
                    <div key={answer.id} className="border-t pt-4">
                      <p className="text-sm font-semibold">{answer.author}</p>
                      <p className="text-gray-600">{answer.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Modal for New Question */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add a New Question</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newQuestion.title}
                  onChange={handleInputChange}
                  placeholder="Enter question title"
                  className="border rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={newQuestion.description}
                  onChange={handleInputChange}
                  placeholder="Enter question description"
                  className="border rounded w-full px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Tags</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    placeholder="Add a tag"
                    className="border rounded flex-grow px-3 py-2"
                  />
                  <Button type="button" onClick={addTag}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex space-x-2">
                  {newQuestion.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 rounded px-2 py-1 text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="ml-2">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
