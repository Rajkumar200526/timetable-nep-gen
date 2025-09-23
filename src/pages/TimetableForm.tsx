import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, BookOpen, Clock, Calendar } from "lucide-react";
import { generateTimetable } from "@/lib/api";

interface FormData {
  studentName: string;
  rollNumber: string;
  program: string;
  selectedCourses: {
    major: string[];
    minor: string[];
    skillBased: string[];
    abilityEnhancement: string[];
    valueAdded: string[];
  };
  preferredTimeSlots: string[];
  additionalRequirements: string;
}

const TimetableForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    rollNumber: "",
    program: "",
    selectedCourses: {
      major: [],
      minor: [],
      skillBased: [],
      abilityEnhancement: [],
      valueAdded: []
    },
    preferredTimeSlots: [],
    additionalRequirements: ""
  });

  const programs = [
    { value: "bed", label: "B.Ed (Bachelor of Education)" },
    { value: "med", label: "M.Ed (Master of Education)" },
    { value: "fyup", label: "FYUP (Four Year Undergraduate Program)" },
    { value: "itep", label: "ITEP (Integrated Teacher Education Program)" }
  ];

  const courseOptions = {
    major: [
      "Mathematics Education", "Science Education", "English Education", 
      "Social Studies Education", "Language Education", "Physical Education"
    ],
    minor: [
      "Educational Psychology", "Curriculum Development", "Assessment Methods",
      "Inclusive Education", "Educational Technology", "Research Methods"
    ],
    skillBased: [
      "Digital Literacy", "Communication Skills", "Critical Thinking",
      "Creative Arts", "Data Analysis", "Project Management"
    ],
    abilityEnhancement: [
      "Environmental Studies", "Health & Wellness", "Ethics & Values",
      "Community Service", "Leadership Development", "Cultural Studies"
    ],
    valueAdded: [
      "Artificial Intelligence in Education", "Sustainable Development",
      "Entrepreneurship", "Global Citizenship", "Innovation Lab", "Coding Fundamentals"
    ]
  };

  const timeSlots = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
    "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"
  ];

  const handleCourseSelection = (courseType: keyof typeof courseOptions, course: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedCourses: {
        ...prev.selectedCourses,
        [courseType]: checked 
          ? [...prev.selectedCourses[courseType], course]
          : prev.selectedCourses[courseType].filter(c => c !== course)
      }
    }));
  };

  const handleTimeSlotSelection = (timeSlot: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferredTimeSlots: checked
        ? [...prev.preferredTimeSlots, timeSlot]
        : prev.preferredTimeSlots.filter(slot => slot !== timeSlot)
    }));
  };

  const validateForm = () => {
    if (!formData.studentName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.rollNumber.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your roll number",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.program) {
      toast({
        title: "Validation Error",
        description: "Please select your program",
        variant: "destructive"
      });
      return false;
    }

    const totalCourses = Object.values(formData.selectedCourses).flat().length;
    if (totalCourses === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one course",
        variant: "destructive"
      });
      return false;
    }

    if (formData.preferredTimeSlots.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one preferred time slot",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const timetableData = await generateTimetable(formData);
      
      // Store data in localStorage for the result page
      localStorage.setItem('timetableData', JSON.stringify(timetableData));
      localStorage.setItem('studentInfo', JSON.stringify({
        name: formData.studentName,
        rollNumber: formData.rollNumber,
        program: formData.program
      }));

      toast({
        title: "Success!",
        description: "Timetable generated successfully",
        variant: "default"
      });

      navigate('/result');
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        title: "Error",
        description: "Failed to generate timetable. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Your Timetable
          </h1>
          <p className="text-lg text-muted-foreground">
            Fill in your details to generate an optimized timetable aligned with NEP 2020
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Information */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Student Information</span>
              </CardTitle>
              <CardDescription>
                Enter your basic details for timetable generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Full Name *</Label>
                  <Input
                    id="studentName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input
                    id="rollNumber"
                    type="text"
                    placeholder="Enter your roll number"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="program">Program *</Label>
                <Select value={formData.program} onValueChange={(value) => setFormData(prev => ({ ...prev, program: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.value} value={program.value}>
                        {program.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Course Selection */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Course Selection</span>
              </CardTitle>
              <CardDescription>
                Select courses from different categories as per NEP 2020 guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(courseOptions).map(([courseType, courses]) => (
                <div key={courseType} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium capitalize">
                      {courseType.replace(/([A-Z])/g, ' $1').trim()} Courses
                    </Label>
                    <Badge variant="secondary">
                      {formData.selectedCourses[courseType as keyof typeof courseOptions].length} selected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {courses.map((course) => (
                      <div key={course} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${courseType}-${course}`}
                          checked={formData.selectedCourses[courseType as keyof typeof courseOptions].includes(course)}
                          onCheckedChange={(checked) => 
                            handleCourseSelection(courseType as keyof typeof courseOptions, course, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={`${courseType}-${course}`}
                          className="text-sm font-normal cursor-pointer leading-tight"
                        >
                          {course}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Time Preferences */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Preferred Time Slots</span>
              </CardTitle>
              <CardDescription>
                Select your preferred time slots for classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="flex items-center space-x-2">
                    <Checkbox
                      id={`time-${timeSlot}`}
                      checked={formData.preferredTimeSlots.includes(timeSlot)}
                      onCheckedChange={(checked) => 
                        handleTimeSlotSelection(timeSlot, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`time-${timeSlot}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {timeSlot}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Requirements */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Additional Requirements</span>
              </CardTitle>
              <CardDescription>
                Any specific requirements or constraints for your timetable
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any specific requirements, constraints, or preferences..."
                value={formData.additionalRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="hero-gradient text-white px-12 py-6 text-lg glow-effect animate-scale-in"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Timetable...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Generate Timetable
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;