import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const Reports = () => {
  // Mock data - replace with real data later
  const weeklyData = [
    { day: "Mon", sessions: 4, minutes: 100 },
    { day: "Tue", sessions: 6, minutes: 150 },
    { day: "Wed", sessions: 3, minutes: 75 },
    { day: "Thu", sessions: 5, minutes: 125 },
    { day: "Fri", sessions: 7, minutes: 175 },
    { day: "Sat", sessions: 2, minutes: 50 },
    { day: "Sun", sessions: 1, minutes: 25 },
  ];

  const totalSessions = weeklyData.reduce((sum, day) => sum + day.sessions, 0);
  const totalMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Usage Reports</h1>
        <p className="text-muted-foreground">Track your productivity journey</p>
      </div>

      <Tabs defaultValue="weekly" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalSessions}</div>
                <p className="text-xs text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
                <p className="text-xs text-muted-foreground">+8% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">85%</div>
                <p className="text-xs text-muted-foreground">+5% from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daily Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{day.day}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{day.sessions} sessions</div>
                        <div className="text-xs text-muted-foreground">{day.minutes}m</div>
                      </div>
                    </div>
                    <Progress value={(day.sessions / 8) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-primary mb-2">120</div>
                <p className="text-muted-foreground">Total sessions this month</p>
                <div className="mt-4">
                  <div className="text-2xl font-bold text-primary">50h 25m</div>
                  <p className="text-muted-foreground">Total focus time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;