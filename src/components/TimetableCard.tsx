import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, User } from "lucide-react";
import { TimetableData, TimetableEntry } from "@/lib/api";

interface TimetableCardProps {
  timetableData: TimetableData;
}

const TimetableCard = ({ timetableData }: TimetableCardProps) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'
  ];

  const getCourseTypeColor = (courseType: TimetableEntry['courseType']) => {
    const colors = {
      major: 'bg-primary text-primary-foreground',
      minor: 'bg-accent text-accent-foreground', 
      skillBased: 'bg-warning text-warning-foreground',
      abilityEnhancement: 'bg-success text-success-foreground',
      valueAdded: 'bg-destructive text-destructive-foreground'
    };
    return colors[courseType] || 'bg-secondary text-secondary-foreground';
  };

  const getCourseTypeLabel = (courseType: TimetableEntry['courseType']) => {
    const labels = {
      major: 'Major',
      minor: 'Minor',
      skillBased: 'Skill',
      abilityEnhancement: 'Ability',
      valueAdded: 'Value'
    };
    return labels[courseType] || courseType;
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Weekly Timetable
          </span>
        </CardTitle>
        <CardDescription>
          Your personalized schedule optimized with AI technology
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left font-semibold bg-muted rounded-tl-lg border-r">
                    <Clock className="h-4 w-4 inline mr-2 text-primary" />
                    Time
                  </th>
                  {days.map((day, index) => (
                    <th 
                      key={day} 
                      className={`p-3 text-center font-semibold bg-muted border-r ${
                        index === days.length - 1 ? 'rounded-tr-lg' : ''
                      }`}
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, timeIndex) => (
                  <tr key={timeSlot} className="border-t">
                    <td className="p-3 font-medium bg-muted/50 border-r text-sm">
                      {timeSlot}
                    </td>
                    {days.map((day, dayIndex) => {
                      const entry = timetableData.schedule[day]?.[timeSlot];
                      return (
                        <td 
                          key={`${day}-${timeSlot}`} 
                          className="p-2 border-r border-border/50 h-20 align-top"
                        >
                          {entry ? (
                            <div className="h-full">
                              <div className={`p-2 rounded-lg h-full flex flex-col justify-between text-xs ${getCourseTypeColor(entry.courseType)} hover:shadow-md transition-all duration-200 cursor-pointer group`}>
                                <div className="space-y-1">
                                  <div className="font-semibold leading-tight line-clamp-2">
                                    {entry.subject}
                                  </div>
                                  <div className="flex items-center text-xs opacity-90">
                                    <User className="h-3 w-3 mr-1" />
                                    <span className="truncate">{entry.faculty}</span>
                                  </div>
                                  <div className="flex items-center text-xs opacity-90">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    <span>{entry.room}</span>
                                  </div>
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className="self-start text-xs px-1 py-0 h-auto bg-white/20 text-white border-0"
                                >
                                  {getCourseTypeLabel(entry.courseType)}
                                </Badge>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                              ---
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-6">
          {days.map((day) => (
            <Card key={day} className="border border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                  {day}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeSlots.map((timeSlot) => {
                  const entry = timetableData.schedule[day]?.[timeSlot];
                  return (
                    <div key={timeSlot} className="flex items-start space-x-3 py-2">
                      <div className="text-sm font-medium text-muted-foreground min-w-[80px]">
                        {timeSlot}
                      </div>
                      {entry ? (
                        <div className={`flex-1 p-3 rounded-lg ${getCourseTypeColor(entry.courseType)}`}>
                          <div className="space-y-2">
                            <div className="font-semibold">{entry.subject}</div>
                            <div className="text-sm opacity-90 space-y-1">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {entry.faculty}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {entry.room}
                                </div>
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs bg-white/20 text-white border-0"
                                >
                                  {getCourseTypeLabel(entry.courseType)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 p-3 text-center text-muted-foreground bg-muted/30 rounded-lg">
                          Free Period
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold mb-3 text-sm">Course Type Legend:</h4>
          <div className="flex flex-wrap gap-2">
            {[
              { type: 'major' as const, label: 'Major Course' },
              { type: 'minor' as const, label: 'Minor Course' },
              { type: 'skillBased' as const, label: 'Skill-Based' },
              { type: 'abilityEnhancement' as const, label: 'Ability Enhancement' },
              { type: 'valueAdded' as const, label: 'Value-Added' }
            ].map(({ type, label }) => (
              <Badge 
                key={type} 
                className={`${getCourseTypeColor(type)} text-xs`}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimetableCard;