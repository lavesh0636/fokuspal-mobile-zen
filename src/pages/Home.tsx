import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Target, Clock, Zap, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [currentSession, setCurrentSession] = useState(1);
  const [sessionType, setSessionType] = useState<"work" | "short-break" | "long-break">("work");
  const { toast } = useToast();

  const sessionConfig = {
    work: { duration: 25 * 60, label: "Focus Session", color: "bg-primary" },
    "short-break": { duration: 5 * 60, label: "Short Break", color: "bg-warning" },
    "long-break": { duration: 15 * 60, label: "Long Break", color: "bg-success" }
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
        title: "🎉 Focus Session Complete!",
        description: "Great job! Time for a well-deserved break.",
      });
      
      // Auto-start break after work session
      const nextType = sessions > 0 && (sessions + 1) % 4 === 0 ? "long-break" : "short-break";
      setSessionType(nextType);
      setTimeLeft(sessionConfig[nextType].duration);
    } else {
      toast({
        title: "Break Complete!",
        description: "Ready to get back to work?",
      });
      setSessionType("work");
      setTimeLeft(sessionConfig.work.duration);
      setCurrentSession(prev => prev + 1);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive) {
      toast({
        title: "Timer Started",
        description: `${sessionConfig[sessionType].label} in progress`,
      });
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(sessionConfig[sessionType].duration);
    toast({
      title: "Timer Reset",
      description: "Ready for a fresh start!",
    });
  };

  const skipSession = () => {
    setIsActive(false);
    handleSessionComplete();
  };

  const progress = ((sessionConfig[sessionType].duration - timeLeft) / sessionConfig[sessionType].duration) * 100;
  const focusScore = Math.min(sessions * 20, 100);
  const streak = Math.floor(sessions / 4);

  return (
    <div className="min-h-screen p-4 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2 slide-up">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="w-8 h-8 text-primary float" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FokusPal
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">Your productivity companion</p>
        <Badge variant="outline" className="text-sm bounce-in">
          Session #{currentSession}
        </Badge>
      </div>

      {/* Main Timer Card */}
      <Card className="mx-auto max-w-md shadow-luxury border-0 animate-scale-in hover:shadow-glow transition-all duration-500">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${sessionConfig[sessionType].color} animate-pulse`}></div>
            <CardTitle className="text-xl">{sessionConfig[sessionType].label}</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {sessionType === "work" ? "Time to focus and get things done!" : "Take a breather and recharge"}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Timer Display */}
          <div className="text-center space-y-6">
            <div className={`relative ${isActive ? 'pulse-glow' : ''}`}>
              <div className="text-7xl font-mono font-bold text-primary mb-4 transition-all duration-300">
                {formatTime(timeLeft)}
              </div>
              {isActive && (
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse"></div>
              )}
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="w-full h-3 transition-all duration-300" />
              <p className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={toggleTimer}
              size="lg"
              className={`flex items-center gap-2 min-w-[120px] ${
                isActive ? 'gradient-primary' : 'gradient-secondary'
              } hover:scale-105 transition-all duration-200`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? "Pause" : "Start"}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            <Button
              onClick={skipSession}
              variant="ghost"
              size="lg"
              className="flex items-center gap-2 hover:scale-105 transition-all duration-200"
            >
              Skip
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <Card className="text-center p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-0">
            <div className="flex flex-col items-center space-y-2">
              <Clock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-primary">{sessions}</div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-0">
            <div className="flex flex-col items-center space-y-2">
              <Zap className="w-6 h-6 text-warning group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-warning">{sessions * 25}m</div>
              <p className="text-xs text-muted-foreground">Focus Time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="text-center p-4 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-0">
            <div className="flex flex-col items-center space-y-2">
              <Award className="w-6 h-6 text-success group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-success">{focusScore}%</div>
              <p className="text-xs text-muted-foreground">Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Banner */}
      {streak > 0 && (
        <Card className="mx-auto max-w-md gradient-success text-white animate-fade-in">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5" />
              <span className="font-semibold">
                🔥 {streak} Pomodoro{streak > 1 ? 's' : ''} Streak!
              </span>
            </div>
            <p className="text-sm opacity-90 mt-1">Keep up the excellent work!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Home;