import { useState, useEffect } from "react";
import axios from 'axios';
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
  const [likedQuestions, setLikedQuestions] = useState([]);
  const [totalLikesByTopic, setTotalLikesByTopic] = useState({});
  const [newComment, setNewComment] = useState({}); 
  const [likedComments, setLikedComments] = useState([]);  
  const [totalLikesByComment, setTotalLikesByComment] = useState({});  
  const [comments, setComments] = useState({});
  const [totalCommentsByTopic, setTotalCommentsByTopic] = useState({});


  const toggleSidebar = () => setIsSidebarExpanded(!isSidebarExpanded);

  // Fetch the access token
  const accessToken = localStorage.getItem("accessToken");

  const sidebarIcons = [
    { icon: HelpCircle, label: "Todas las preguntas", onClick: () => setSortBy("recent") },
    { icon: Clock, label: "Sin respuesta" },
    { icon: Tag, label: "Etiquetas"},
    { 
      icon: PlusCircle, 
      label: "Añadir pregunta", 
      onClick: () => setIsModalOpen(true) // Open the modal when the button is clicked
    },
  ];

  useEffect(() => {
    const fetchQuestionsAndLikes = async () => {
      try {
          // Obtener preguntas
          const response = await axios.get('http://localhost:8000/forum/topics/', {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
          setQuestions(response.data);
  
          // Obtener total de comentarios por tópico
          const commentsPromises = response.data.map(async (question) => {
              const commentsResponse = await axios.get(`http://localhost:8000/forum/topics/${question.id}/comments/`, {
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                  },
              });
              return {
                  id: question.id,
                  total_comments: commentsResponse.data.total_comments,
              };
          });
  
          const totalCommentsArray = await Promise.all(commentsPromises);
          const totalCommentsByTopicData = {};
          totalCommentsArray.forEach((item) => {
              totalCommentsByTopicData[item.id] = item.total_comments;
          });
  
          setTotalCommentsByTopic(totalCommentsByTopicData);
  
          // Obtener likes
          const likesResponse = await axios.get('http://localhost:8000/forum/likes/', {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
          });
  
          const likedIds = likesResponse.data.user_likes.map((like) => like.topic);
          setLikedQuestions(likedIds);
  
          const totalLikesByTopicData = {};
          likesResponse.data.topic_likes.forEach((like) => {
              totalLikesByTopicData[like.topic] = like.total_likes;
          });
          setTotalLikesByTopic(totalLikesByTopicData);
      } catch (error) {
          console.error("Error fetching questions or likes:", error);
      }
  };  

    fetchQuestionsAndLikes();
  }, [accessToken]);

  const toggleAnswers = async (questionId) => {
    setOpenAnswers((prev) =>
        prev.includes(questionId)
            ? prev.filter((id) => id !== questionId)
            : [...prev, questionId]
    );

    // Cargar comentarios solo si no han sido cargados antes
    if (!comments[questionId]) {
        try {
            const commentsResponse = await axios.get(`http://localhost:8000/forum/topics/${questionId}/comments/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Almacena solo el arreglo de comentarios y el total
            setComments((prev) => ({
                ...prev,
                [questionId]: commentsResponse.data.comments,
            }));

            // Almacena el total de comentarios
            setTotalCommentsByTopic((prev) => ({
                ...prev,
                [questionId]: commentsResponse.data.total_comments,
            }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    }
};


  

  const handleLikeToggle = async (questionId) => {
    try {
      const isLiked = likedQuestions.includes(questionId);

      if (isLiked) {
        await axios.post(
          `http://localhost:8000/forum/likes/`,
          { topic: questionId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLikedQuestions((prev) => prev.filter((id) => id !== questionId));

        setTotalLikesByTopic((prev) => ({
          ...prev,
          [questionId]: prev[questionId] - 1,
        }));
      } else {
        await axios.post(
          `http://localhost:8000/forum/likes/`,
          { topic: questionId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLikedQuestions((prev) => [...prev, questionId]);

        setTotalLikesByTopic((prev) => ({
          ...prev,
          [questionId]: (prev[questionId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

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

  const handleCommentLikeToggle = async (commentId) => {
    try {
      const isLiked = likedComments.includes(commentId);
  
      if (isLiked) {
        // Eliminar el like
        await axios.post(
          `http://localhost:8000/forum/likes/`,
          { comment: commentId },  // El like es para un comentario
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLikedComments((prev) => prev.filter((id) => id !== commentId));
        setTotalLikesByComment((prev) => ({
          ...prev,
          [commentId]: prev[commentId] - 1,
        }));
      } else {
        // Agregar like
        await axios.post(
          `http://localhost:8000/forum/likes/`,
          { comment: commentId },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        setLikedComments((prev) => [...prev, commentId]);
        setTotalLikesByComment((prev) => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error("Error toggling like for comment:", error);
    }
  };
  

  const handleCommentSubmit = async (e, topicId) => {
    e.preventDefault();

    try {
        // Enviar el nuevo comentario
        await axios.post(
            `http://localhost:8000/forum/topics/${topicId}/comments/`,
            {
                message: newComment[topicId],
                topic_related: topicId  
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Limpiar el campo de comentario tras el envío
        setNewComment((prev) => ({
            ...prev,
            [topicId]: "" // Limpiar solo el campo del tópico actual
        }));

        // Obtener los comentarios actualizados para ese tópico
        const commentsResponse = await axios.get(`http://localhost:8000/forum/topics/${topicId}/comments/`);
        console.log("Comments Response:", commentsResponse.data);
        
        // Actualizar solo los comentarios del tópico correspondiente
        setComments((prev) => ({
            ...prev,
            [topicId]: commentsResponse.data.comments // Cambiado aquí
        }));

    } catch (error) {
        console.error("Error posting comment:", error);
    }
    
};



  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isSidebarExpanded ? "w-64" : "w-16"}`}>
        <div className="flex items-center justify-between p-4">
          <span className={`font-semibold ${isSidebarExpanded ? "" : "hidden"}`}>Menú</span>
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
            <Search className="absolute left-2 top-2.5 h-6 w-6 text-gray-500" />
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
            <option value="recent">Más recientes</option>
            <option value="likes">Más votados</option>
            <option value="answers">Más respondidos</option>
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
                <button
                  onClick={() => handleLikeToggle(question.id)}
                  className={`flex items-center ${likedQuestions.includes(question.id) ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  <ThumbsUp className="mr-1 h-6 w-6" /> {totalLikesByTopic[question.id] || 0}
                </button>
                <button onClick={() => toggleAnswers(question.id)} className="flex items-center">
                  <MessageCircle className="mr-1 h-6 w-6" /> {totalCommentsByTopic[question.id]  || 0}
                  
                </button>
              </div>
            </div>
        
            {/* Mostrar comentarios si están abiertos */}
            {openAnswers.includes(question.id) && (
            <div className="mt-4 space-y-4">
              {/* Mostrar los comentarios cargados dinámicamente */}
              {comments[question.id]?.map((comment) => (
                <div key={comment.id} className="border-t pt-4">
                  <p className="text-sm font-semibold">{comment.author_name}</p>
                  <p className="text-gray-600">{comment.message}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                    <span>{new Date(comment.post_date).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleCommentLikeToggle(comment.id)}
                      className={`flex items-center ${likedComments.includes(comment.id) ? 'text-blue-500' : 'text-gray-500'}`}
                    >
                      <ThumbsUp className="mr-1 h-6 w-6" /> {totalLikesByComment[comment.id] || 0}
                    </button>
                  </div>
                </div>
              ))}

              {/* Formulario para agregar nuevo comentario */}
              <form onSubmit={(e) => handleCommentSubmit(e, question.id)} className="mt-4">
                <textarea
                  name="comment"
                  rows="3"
                  className="w-full border rounded p-2"
                  placeholder="Write a comment..."
                  value={newComment[question.id] || ""}
                  onChange={(e) => setNewComment({ ...newComment, [question.id]: e.target.value })}
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit">Publicar Comentario</Button>
                </div>
              </form>
            </div>
          )}
          </div>
        ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Agregar nueva pregunta</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Título</label>
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
                <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
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
                <label className="block text-gray-700 font-semibold mb-2">Etiquetas</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    placeholder="Add a tag"
                    className="border rounded flex-grow px-3 py-2"
                  />
                  <Button type="button" onClick={addTag}>
                    Agregar etiqueta
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
                <Button type="submit">Enviar</Button>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="ml-2">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}