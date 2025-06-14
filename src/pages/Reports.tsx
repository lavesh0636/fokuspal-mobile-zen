import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Target, Calendar, Clock, Zap, Award, Activity } from "lucide-react";

const Reports = () => {
  // Enhanced mock data with more realistic patterns
  const weeklyData = [
    { day: "Mon", sessions: 6, minutes: 150, completionRate: 85, streak: 3 },
    { day: "Tue", sessions: 8, minutes: 200, completionRate: 92, streak: 4 },
    { day: "Wed", sessions: 4, minutes: 100, completionRate: 75, streak: 2 },
    { day: "Thu", sessions: 7, minutes: 175, completionRate: 88, streak: 3 },
    { day: "Fri", sessions: 9, minutes: 225, completionRate: 95, streak: 5 },
    { day: "Sat", sessions: 3, minutes: 75, completionRate: 70, streak: 1 },
    { day: "Sun", sessions: 2, minutes: 50, completionRate: 60, streak: 1 },
  ];

  const monthlyData = {
    totalSessions: 156,
    totalMinutes: 3900,
    avgDaily: 5.2,
    bestDay: { day: "Friday", sessions: 12 },
    consistencyScore: 87
  };

  const totalSessions = weeklyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
  const avgCompletionRate = Math.round(weeklyData.reduce((sum, day) => sum + day.completionRate, 0) / weeklyData.length);
  const maxSessions = Math.max(...weeklyData.map(day => day.sessions));

  const achievements = [
    { title: "Week Warrior", desc: "Completed 7 days in a row", earned: true },
    { title: "Focus Master", desc: "90%+ completion rate", earned: avgCompletionRate >= 90 },
    { title: "Streak Keeper", desc: "5+ session streak", earned: weeklyData.some(day => day.streak >= 5) },
    { title: "Consistency King", desc: "Daily sessions all week", earned: weeklyData.every(day => day.sessions > 0) }
  ];

  return (
    <div className="min-h-screen p-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">Track your productivity journey</p>
      </div>

      <Tabs defaultValue="weekly" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="weekly" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            This Week
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            This Month
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-8">
          {/* Weekly Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="gradient-primary text-white border-0 shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Sessions</p>
                    <p className="text-3xl font-bold">{totalSessions}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+12% vs last week</span>
                    </div>
                  </div>
                  <Target className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-secondary text-white border-0 shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Focus Time</p>
                    <p className="text-3xl font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+8% vs last week</span>
                    </div>
                  </div>
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-success text-white border-0 shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Completion Rate</p>
                    <p className="text-3xl font-bold">{avgCompletionRate}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">+5% vs last week</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0 shadow-luxury">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Best Streak</p>
                    <p className="text-3xl font-bold">{Math.max(...weeklyData.map(day => day.streak))}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs">Sessions in a row</span>
                    </div>
                  </div>
                  <Zap className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Progress Chart */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="space-y-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold w-8">{day.day}</span>
                        <Badge variant={day.sessions >= 6 ? "default" : "secondary"} className="text-xs">
                          {day.sessions} sessions
                        </Badge>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm font-medium">{day.minutes}m</div>
                        <div className="text-xs text-muted-foreground">{day.completionRate}% complete</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={(day.sessions / maxSessions) * 100} 
                        className="h-3 transition-all duration-500"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sessions</span>
                        <span>{day.sessions}/{maxSessions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Weekly Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={achievement.title}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      achievement.earned 
                        ? 'bg-success/10 border-success/20 text-success-foreground' 
                        : 'bg-muted/50 border-border text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Award className={`w-5 h-5 mt-0.5 ${achievement.earned ? 'text-success' : 'text-muted-foreground'}`} />
                      <div>
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs mt-1">{achievement.desc}</p>
                        {achievement.earned && (
                          <Badge variant="outline" className="mt-2 text-xs border-success text-success">
                            Earned!
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-8">
          {/* Monthly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-full md:col-span-2 gradient-primary text-white border-0 shadow-luxury">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Monthly Summary</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-4xl font-bold">{monthlyData.totalSessions}</div>
                      <p className="text-sm opacity-90">Total Sessions</p>
                    </div>
                    <div>
                      <div className="text-4xl font-bold">{Math.floor(monthlyData.totalMinutes / 60)}h</div>
                      <p className="text-sm opacity-90">Focus Time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-0">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{monthlyData.avgDaily}</div>
                  <p className="text-sm text-muted-foreground">Avg Sessions/Day</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-accent">{monthlyData.bestDay.sessions}</div>
                  <p className="text-xs text-muted-foreground">Best Day ({monthlyData.bestDay.day})</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Consistency Meter */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>Consistency Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall Consistency</span>
                  <span className="text-lg font-bold text-primary">{monthlyData.consistencyScore}%</span>
                </div>
                <Progress value={monthlyData.consistencyScore} className="h-4" />
                <p className="text-sm text-muted-foreground">
                  Great job! You've maintained consistent focus sessions throughout the month.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;