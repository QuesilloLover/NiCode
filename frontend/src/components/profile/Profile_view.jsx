import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Medal, Swords, ThumbsUp, Code2 } from "lucide-react"
import Header from '../components_layouts/header'

export default function Component() {
  const user = {
    name: "Erick Saballos",
    username: "lilsrick",
    avatar: "/placeholder.svg?height=100&width=100",
    level: 42,
    xp: 8750,
    xpToNextLevel: 10000,
    badges: [
      { name: <strong >Problem Solver</strong>, icon: <Trophy className="h-4 w-4 text-white" /> },
      { name: "Code Ninja", icon: <Swords className="h-4 w-4 text-white" /> },
      { name: "Top Contributor", icon: <ThumbsUp className="h-4 w-4 text-white" /> },
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
      <Header/>
    
      <div className="min-h-screen bg-[#1f2937] text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-5 mr-5">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gray-600">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-gray-400">@{user.username}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  {user.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-gray-700 text-gray">
                       {React.cloneElement(badge.icon, { color: "#3632de" })} 
                      {badge.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-center sm:text-right">
                <p className="text-xl font-semibold text-white">Level {user.level}</p>
                <p className="text-sm text-gray-400 mb-2">
                  XP: {user.xp} / {user.xpToNextLevel}
                </p>
                <Progress value={(user.xp / user.xpToNextLevel) * 100} className="w-full sm:w-[200px] bg-gray-700" indicatorClassName="bg-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Medal className="h-5 w-5 text-white" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.badges.map((badge, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded-full">{badge.icon}</div>
                    <div>
                      <p className="font-semibold text-white text-left">{badge.name}</p>
                      <p className="text-sm text-gray-400">Earned for exceptional performance</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Swords className="h-5 w-5 text-white" />
                Recent Battles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {user.matchHistory.map((match) => (
                  <li key={match.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-600 text-white">{match.opponent[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">vs {match.opponent}</p>
                        <p className="text-sm text-gray-400">{match.date}</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <Badge variant={match.result === "Win" ? "success" : "destructive"} className={`${match.result === "Win" ? "bg-green-600" : "bg-red-600"} text-white`}>
                        {match.result}
                      </Badge>
                      <p className="text-sm text-gray-400 mt-1 flex items-center sm:justify-end gap-1">
                        <Code2 className="h-4 w-4 text-white" />
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
      </div>
    </>




    
  )
}