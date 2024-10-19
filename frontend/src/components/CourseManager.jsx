import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ReactMarkdown from 'react-markdown'

// Mock API functions (replace these with actual API calls)
const api = {
  getCourses: async () => {
    // Simulating API call
    return []
  },
  createCourse: async (course) => {
    // Simulating API call
    console.log('Creating course:', course)
    return { ...course, id: Date.now().toString() }
  },
  updateCourse: async (course) => {
    // Simulating API call
    console.log('Updating course:', course)
    return course
  },
  deleteCourse: async (id) => {
    // Simulating API call
    console.log('Deleting course:', id)
  },
  getProblems: async () => {
    const token = localStorage.getItem('accessToken');
  
    const response = await fetch(`http://localhost:8000/problems`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())    
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching problems:', error);
    });
  
    return response;
  },
  
}

export default function Component() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [previewContent, setPreviewContent] = useState('')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const loadedCourses = await api.getCourses()
    setCourses(loadedCourses)
  }

  const handleCreateCourse = async (course) => {
    const newCourse = await api.createCourse(course)
    setCourses([...courses, newCourse])
  }

  const handleUpdateCourse = async (course) => {
    const updatedCourse = await api.updateCourse(course)
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c))
    setSelectedCourse(updatedCourse)
    setIsEditing(false)
  }

  const handleDeleteCourse = async (id) => {
    await api.deleteCourse(id)
    setCourses(courses.filter(c => c.id !== id))
    setSelectedCourse(null)
  }

  return (
    <div className="min-h-screen bg-[#050064] text-black">
      <div className="container flex-col mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-[#00FF52]">Agregar Curso</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6 bg-[#3632DE] p-6 rounded-lg">
            <CourseList
              courses={courses}
              onSelectCourse={setSelectedCourse}
              onCreateCourse={() => setIsEditing(true)}
              onDeleteCourse={handleDeleteCourse}
            />
            {selectedCourse && !isEditing && (
              <CourseDetail
                course={selectedCourse}
                onEdit={() => setIsEditing(true)}
              />
            )}
            {(isEditing || !selectedCourse) && (
              <CourseForm
                course={isEditing ? selectedCourse : null}
                onSubmit={isEditing ? handleUpdateCourse : handleCreateCourse}
                onCancel={() => {
                  setIsEditing(false)
                  setSelectedCourse(null)
                }}
                onPreview={setPreviewContent}
              />
            )}
          </div>
          <MarkdownPreview content={previewContent} />
        </div>
      </div>
    </div>
  )
}

function CourseList({ courses, onSelectCourse, onCreateCourse, onDeleteCourse }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#00FF52]">Courses</h2>
      <ul className="space-y-3">
        {courses.map(course => (
          <li key={course.id} className="flex justify-between items-center bg-[#050064] p-3 rounded">
            <Button variant="ghost" onClick={() => onSelectCourse(course)} className="text-black hover:text-[#00FF52]">{course.title}</Button>
            <Button variant="destructive" onClick={() => onDeleteCourse(course.id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CourseDetail({ course, onEdit }) {
  return (
    <div className="bg-[#050064] p-4 rounded">
      <h2 className="text-2xl font-semibold mb-2 text-[#00FF52]">{course.title}</h2>
      <Button onClick={onEdit} className="mb-4 bg-[#00FF52] text-[#050064] hover:bg-[#00CC41]">Edit Course</Button>
      <ModuleList modules={course.modules} />
    </div>
  )
}

function CourseForm({ course, onSubmit, onCancel, onPreview }) {
  const [title, setTitle] = useState(course?.title || '')
  const [description, setDescription] = useState(course?.description || '')
  const [modules, setModules] = useState(course?.modules || [])


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create the payload
    const payload = {
      id: course?.id || '',  // Include the course id if it's available, otherwise an empty string
      title,                 // Course title
      description,           // Course description
      modules: modules.map((module, index) => ({
        title: module.title,
        order: index + 1,                   // Define order based on the index
        item_type: module.type,             // Module type ('content', 'video', 'problem')
        markdown_text: module.content,  
        problem: module.type === 'problem' ? module.problemId : null
      }))
    };
  
    // Submit the payload using fetch
    try {
      const token = localStorage.getItem('accessToken');  // Assuming you use token authentication
  
      const response = await fetch('http://localhost:8000/courses/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,  // Include the authorization token
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),  // Send the payload as JSON
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating course:', errorData);
      } else {
        const data = await response.json();
        console.log('Course created successfully:', data);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-[#00FF52]">Título del Curso</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-[#050064] text-black border-[#00FF52] focus:border-[#00FF52]"
        />
      </div>
      <div>
        <Label htmlFor="description" className="text-[#00FF52]">Descripción del Curso</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="bg-[#050064] text-black border-[#00FF52] focus:border-[#00FF52]"
        />
      </div>
      <ModuleForm
        modules={modules}
        onUpdateModules={setModules}
        onPreview={onPreview}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="border-[#00FF52] text-[#00FF52] hover:bg-[#00FF52] hover:text-[#050064]">Cancelar</Button>
        <Button type="submit" className="bg-[#00FF52] text-[#050064] hover:bg-[#00CC41]">{course ? 'Actualizar Curso' : 'Crear Curso'}</Button>
      </div>
    </form>
  )
}

function ModuleList({ modules }) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold mb-2 text-[#00FF52]">Módulos</h3>
      <ul className="space-y-4">
        {modules.map((module, index) => (
          <li key={index} className="border border-[#00FF52] p-4 rounded">
            <h4 className="font-semibold text-[#00FF52]">{module.title}</h4>
            <p className="text-black">Type: {module.item_type}</p>
            {module.item_type !== 'problem' && (
              <div className="mt-2 text-black">
                <ReactMarkdown>{module.markdown_text}</ReactMarkdown>
              </div>
            )}
            {module.item_type === 'problem' && (
              <p className="text-black">Problem ID: {module.problem}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ModuleForm({ modules, onUpdateModules, onPreview }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('content')
  const [content, setContent] = useState('')
  const [problems, setProblems] = useState([])
  const [selectedProblem, setSelectedProblem] = useState('')

  useEffect(() => {
    if (type === 'problem') {
      loadProblems()
    }
  }, [type])

  const loadProblems = async () => {
    const loadedProblems = await api.getProblems()
    setProblems(loadedProblems)
  }

  const handleAddModule = () => {
    const newModule = {
      title,
      type,
      content: type === 'problem' ? '' : content,
      problemId: type === 'problem' ? selectedProblem : undefined,
    }
    onUpdateModules([...modules, newModule])
    setTitle('')
    setType('content')
    setContent('')
    setSelectedProblem('')
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-[#00FF52]">Agregar módulo</h3>
      <div>
        <Label htmlFor="moduleTitle" className="text-[#00FF52]">Título del Módulo</Label>
        <Input
          id="moduleTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-[#050064] text-black border-[#00FF52] focus:border-[#00FF52]"
        />
      </div>
      <div>
        <Label htmlFor="moduleType" className="text-[#00FF52]">Tipo de Módulo</Label>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger id="moduleType" className="bg-[#050064] text-black border-[#00FF52]">
            <SelectValue placeholder="Select module type" />
          </SelectTrigger>
          <SelectContent className="bg-[#050064] text-black border-[#00FF52]">
            <SelectItem value="content" className="hover:bg-[#3632DE]">Contenido</SelectItem>
            <SelectItem value="video" className="hover:bg-[#3632DE]">Video</SelectItem>
            <SelectItem value="problem" className="hover:bg-[#3632DE]">Problema</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === 'problem' ? (
        <div>
          <Label htmlFor="problemSelect" className="text-[#00FF52]">Seleccionar Problema</Label>
          <Select value={selectedProblem} onValueChange={(value) => setSelectedProblem(value)}>
            <SelectTrigger id="problemSelect" className="bg-[#050064] text-black border-[#00FF52]">
              <SelectValue placeholder="Select a problem" />
            </SelectTrigger>
            <SelectContent className="bg-[#050064] text-black border-[#00FF52]">
              {problems.map((problem) => (
                <SelectItem key={problem.id} value={problem.id.toString()} className="hover:bg-[#3632DE]">
                  {problem.id} - {problem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div>
          <Label htmlFor="moduleContent" className="text-[#00FF52]">Contenido del Módulo (Markdown)</Label>
          <Textarea
            id="moduleContent"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
              onPreview(e.target.value)
            }}
            rows={5}
            required
            className="bg-[#050064] text-black border-[#00FF52] focus:border-[#00FF52]"
          />
        </div>
      )}
      <Button type="button" onClick={handleAddModule} className="bg-[#00FF52] text-[#050064] hover:bg-[#00CC41]">Agregar Módulo</Button>
      <ModuleList modules={modules} />
    </div>
  )
}

function MarkdownPreview({ content }) {
  return (
    <div className="border border-[#00FF52] rounded p-6 bg-[#3632DE]">
      <h2 className="text-2xl font-semibold mb-4 text-[#00FF52]">Markdown Preview</h2>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  )
}