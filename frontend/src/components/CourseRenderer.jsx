import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import ReactMarkdown from 'react-markdown'

// Mock API function (replace with actual API call)
const api = {
  getCourses: async () => {
    // Simulating API call
    return [
      {
        id: '1',
        title: 'Introduction to React',
        modules: [
          { id: '1', title: 'Getting Started', type: 'content', content: '# Getting Started with React\n\nReact is a popular JavaScript library for building user interfaces.' },
          { id: '2', title: 'Components', type: 'content', content: '# React Components\n\nComponents are the building blocks of React applications.' },
          { id: '3', title: 'State and Props', type: 'content', content: '# State and Props\n\nLearn how to manage data in React components.' },
          { id: '4', title: 'React Quiz', type: 'problem', problemId: '101' }
        ]
      },
      {
        id: '2',
        title: 'Advanced React Techniques',
        modules: [
          { id: '5', title: 'Hooks', type: 'content', content: '# React Hooks\n\nHooks are a powerful feature introduced in React 16.8.' },
          { id: '6', title: 'Context API', type: 'content', content: '# Context API\n\nLearn how to manage global state in React applications.' },
          { id: '7', title: 'Performance Optimization', type: 'content', content: '# Optimizing React Apps\n\nTechniques to improve the performance of your React applications.' },
          { id: '8', title: 'Advanced React Quiz', type: 'problem', problemId: '102' }
        ]
      }
    ]
  }
}

// Mock Problem component (replace with actual implementation)
function Problem({ id }) {
  return (
    <div className="bg-[#3632DE] p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-[#00FF52]">Problem Component</h2>
      <p className="text-white">Rendering problem with ID: {id}</p>
    </div>
  )
}

export default function CourseRenderer() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    const loadedCourses = await api.getCourses()
    setCourses(loadedCourses)
    if (loadedCourses.length > 0) {
      setSelectedCourse(loadedCourses[0])
      setSelectedModule(loadedCourses[0].modules[0])
    }
  }

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
  }

  return (
    <div className="flex h-screen bg-[#050064] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#3632DE] border-r border-[#00FF52]">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-[#00FF52]">Courses</h2>
            {courses.map((course) => (
              <div key={course.id} className="mb-4">
                <h3 className="font-semibold mb-2 text-[#00FF52]">{course.title}</h3>
                <ul>
                  {course.modules.map((module) => (
                    <li key={module.id}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start text-white hover:text-[#00FF52] ${selectedModule?.id === module.id ? 'bg-[#050064]' : ''}`}
                        onClick={() => handleModuleSelect(module)}
                      >
                        {module.title}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto bg-[#050064]">
        {selectedModule && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-[#00FF52]">{selectedModule.title}</h2>
            {selectedModule.type === 'content' ? (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{selectedModule.content}</ReactMarkdown>
              </div>
            ) : (
              <Problem id={selectedModule.problemId} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}