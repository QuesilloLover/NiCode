import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Swords, ThumbsUp, Code2 } from "lucide-react"
import quesillo from "@/assets/quesillo.png"
import Header from "../components_layouts/header"

export default function Component() {
  const user = {
    name: "Adilia Moreno",
    username: "quesillolover",
    avatar: quesillo,
    level: 42,
    xp: 8750,
    xpToNextLevel: 10000,
    badges: [
      { name: "incredible", icon: <Trophy className="h-4 w-4" /> },
      { name: "faster", icon: <Swords className="h-4 w-4" /> },
      { name: "coding great", icon: <ThumbsUp className="h-4 w-4" /> },
    ],
    matchHistory: [
      { id: 1, opponent: "john_smith", result: "Win", language: "Python", date: "2023-10-12" },
      { id: 2, opponent: "alice_wonder", result: "Loss", language: "JavaScript", date: "2023-10-10" },
      { id: 3, opponent: "bob_coder", result: "Win", language: "Java", date: "2023-10-08" },
      { id: 4, opponent: "eva_programmer", result: "Win", language: "C++", date: "2023-10-05" },
    ],
  }

  return (
    <>
      {/* Header */}
      <Header/>
      {/* Profile */}
      <div className="min-h-screen bg-[#1a202c] text-white p-4">
        <div className="max-w-4xl mx-auto grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="md:col-span-2 bg-white text-[#1a202c]">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 mt-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-gray-200 text-[#1a202c]">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-600">@{user.username}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#2d3748] text-white px-2 py-1 text-xs">
                        {badge.icon}
                        <span className="ml-1">{badge.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">Level {user.level}</span>
                  <span className="text-gray-600">XP: {user.xp} / {user.xpToNextLevel}</span>
                </div>
                <Progress value={(user.xp / user.xpToNextLevel) * 100} className="h-2 mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white text-[#1a202c]">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.badges.map((badge, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-[#2d3748] p-2 rounded-full text-white">{badge.icon}</div>
                    <div>
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-sm text-gray-600">Turquear a caballo bayo de manera exitosa</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-3 bg-white text-[#1a202c]">
            <CardHeader>
              <CardTitle>Recent Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.matchHistory.map((match) => (
                  <li key={match.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200">{match.opponent[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">vs {match.opponent}</p>
                        <p className="text-sm text-gray-600">{match.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={match.result === "Win" ? "success" : "destructive"} className={`${match.result === "Win" ? "bg-green-500" : "bg-red-500"} text-white px-2 py-1`}>
                        {match.result}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1 flex items-center justify-end gap-1">
                        <Code2 className="h-4 w-4" />
                        {match.language}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}