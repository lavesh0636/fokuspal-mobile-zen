import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const { toast } = useToast();

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
      setSessions(prev => prev + 1);
      toast({
        title: "Pomodoro Complete!",
        description: "Great job! Time for a break.",
      });
      setTimeLeft(25 * 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">FokusPal</h1>
        <p className="text-muted-foreground">Stay focused, stay productive</p>
      </div>

      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Pomodoro Timer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-4">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleTimer}
              variant="default"
              size="lg"
              className="flex items-center gap-2"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? "Pause" : "Start"}
            </Button>

            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Completed Sessions</span>
              <span className="text-2xl font-bold text-primary">{sessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Focus Time</span>
              <span className="text-2xl font-bold text-primary">{sessions * 25}m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Focus Score</span>
              <span className="text-2xl font-bold text-primary">{Math.min(sessions * 20, 100)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;