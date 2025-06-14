import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Clock, TrendingUp, CheckCircle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionType, setSessionType] = useState<"work" | "short-break" | "long-break">("work");
  const { toast } = useToast();

  const sessionConfig = {
    work: { duration: 25 * 60, label: "Focus Session", color: "primary" },
    "short-break": { duration: 5 * 60, label: "Short Break", color: "warning" },
    "long-break": { duration: 15 * 60, label: "Long Break", color: "success" }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    if (sessionType === "work") {
      setSessions(prev => prev + 1);
      toast({
        title: "🎉 Session Complete!",
        description: "Excellent work! Time for a well-deserved break.",
      });
      
      const nextType = sessions > 0 && (sessions + 1) % 4 === 0 ? "long-break" : "short-break";
      setSessionType(nextType);
      setTimeLeft(sessionConfig[nextType].duration);
    } else {
      toast({
        title: "Break Complete!",
        description: "Ready to focus again?",
      });
      setSessionType("work");
      setTimeLeft(sessionConfig.work.duration);
      setCurrentSession(prev => prev + 1);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionConfig[sessionType].duration);
  };

  const skipSession = () => {
    setIsActive(false);
    handleSessionComplete();
  };

  const progress = ((sessionConfig[sessionType].duration - timeLeft) / sessionConfig[sessionType].duration) * 100;
  const dailyGoal = 8;
  const completionRate = Math.min((sessions / dailyGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">FokusPal</h1>
            <p className="text-muted-foreground mt-1">Your productivity companion</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Session #{currentSession}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      sessionType === "work" ? "bg-primary" : 
                      sessionType === "short-break" ? "bg-warning" : "bg-success"
                    }`}></div>
                    <CardTitle className="text-xl">{sessionConfig[sessionType].label}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {sessionType === "work" ? "FOCUS" : "BREAK"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pb-8">
                {/* Timer Display */}
                <div className="text-center space-y-6">
                  <div className={`text-7xl md:text-8xl font-mono font-light text-primary tracking-tight transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="space-y-3">
                    <Progress value={progress} className="w-full h-2" />
                    <p className="text-sm text-muted-foreground">
                      {Math.round(progress)}% complete • {Math.floor(timeLeft / 60)} minutes remaining
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="px-8 py-3 gradient-primary text-white border-0 hover:opacity-90 transition-opacity"
                  >
                    {isActive ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                    {isActive ? "Pause" : "Start"}
                  </Button>

                  <Button
                    onClick={resetTimer}
                    variant="outline"
                    size="lg"
                    className="px-6"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>

                  <Button
                    onClick={skipSession}
                    variant="ghost"
                    size="lg"
                    className="px-6"
                  >
                    Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Today's Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{sessions}</div>
                  <p className="text-sm text-muted-foreground">of {dailyGoal} sessions</p>
                  <Progress value={completionRate} className="mt-3 h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Clock className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <div className="text-lg font-semibold">{sessions * 25}m</div>
                    <p className="text-xs text-muted-foreground">Focus Time</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                    <div className="text-lg font-semibold">{Math.round(completionRate)}%</div>
                    <p className="text-xs text-muted-foreground">Daily Goal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 shadow-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <div className="text-xl font-bold text-success">{Math.floor(sessions / 4)}</div>
                <p className="text-xs text-muted-foreground">Cycles</p>
              </Card>
              
              <Card className="border-0 shadow-lg p-4 text-center">
                <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
                <div className="text-xl font-bold text-warning">
                  {sessions > 0 ? Math.floor((sessions * 25) / sessions) : 0}m
                </div>
                <p className="text-xs text-muted-foreground">Avg Session</p>
              </Card>
            </div>

            {/* Achievement */}
            {sessions >= 4 && (
              <Card className="border-0 gradient-success text-white shadow-lg">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <p className="font-semibold">Pomodoro Cycle Complete!</p>
                  <p className="text-sm opacity-90 mt-1">4 sessions completed</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;