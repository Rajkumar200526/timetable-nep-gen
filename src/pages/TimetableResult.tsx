import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import TimetableCard from "@/components/TimetableCard";
import { 
  Download, 
  FileText, 
  RotateCcw, 
  Calendar, 
  User, 
  BookOpen, 
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TimetableData } from "@/lib/api";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const TimetableResult = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const storedTimetableData = localStorage.getItem('timetableData');
    const storedStudentInfo = localStorage.getItem('studentInfo');

    if (storedTimetableData && storedStudentInfo) {
      setTimetableData(JSON.parse(storedTimetableData));
      setStudentInfo(JSON.parse(storedStudentInfo));
    } else {
      // Redirect to form if no data found
      toast({
        title: "No Data Found",
        description: "Please fill the form first to generate a timetable",
        variant: "destructive"
      });
      navigate('/form');
    }
  }, [navigate, toast]);

  const exportToPDF = async () => {
    if (!timetableData || !studentInfo) return;

    setIsExporting(true);
    try {
      const doc = new jsPDF('landscape');
      
      // Header
      doc.setFontSize(20);
      doc.text('AI-Generated Timetable', 20, 20);
      doc.setFontSize(12);
      doc.text(`Student: ${studentInfo.name} | Roll No: ${studentInfo.rollNumber}`, 20, 30);
      doc.text(`Program: ${studentInfo.program.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`, 20, 40);

      // Prepare table data
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
      
      const tableData = timeSlots.map(timeSlot => {
        const row = [timeSlot];
        days.forEach(day => {
          const entry = timetableData.schedule[day]?.[timeSlot];
          row.push(entry ? `${entry.subject}\n${entry.faculty}\n${entry.room}` : '---');
        });
        return row;
      });

      doc.autoTable({
        head: [['Time', ...days]],
        body: tableData,
        startY: 50,
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [34, 58, 138] },
        alternateRowStyles: { fillColor: [245, 247, 250] }
      });

      doc.save(`timetable-${studentInfo.rollNumber}.pdf`);
      
      toast({
        title: "Success!",
        description: "Timetable exported to PDF successfully",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async () => {
    if (!timetableData || !studentInfo) return;

    setIsExporting(true);
    try {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const timeSlots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'];
      
      const worksheetData = [];
      
      // Header row
      worksheetData.push(['Time Slot', ...days]);
      
      // Data rows
      timeSlots.forEach(timeSlot => {
        const row = [timeSlot];
        days.forEach(day => {
          const entry = timetableData.schedule[day]?.[timeSlot];
          row.push(entry ? `${entry.subject} | ${entry.faculty} | ${entry.room}` : '---');
        });
        worksheetData.push(row);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetable');
      
      XLSX.writeFile(workbook, `timetable-${studentInfo.rollNumber}.xlsx`);
      
      toast({
        title: "Success!",
        description: "Timetable exported to Excel successfully",
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast({
        title: "Export Failed", 
        description: "Failed to export Excel. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!timetableData || !studentInfo || !timetableData.metadata) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we load your timetable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center mb-4">
            <CheckCircle className="h-12 w-12 text-success mr-3" />
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Timetable Generated Successfully!
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Your optimized schedule is ready
              </p>
            </div>
          </div>
        </div>

        {/* Student Info & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <User className="h-4 w-4 text-primary" />
                <span>Student Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="font-medium">{studentInfo.name}</p>
              <p className="text-sm text-muted-foreground">{studentInfo.rollNumber}</p>
              <Badge variant="secondary" className="mt-2">
                {studentInfo.program.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Total Subjects</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{timetableData.metadata.totalSubjects}</p>
              <p className="text-sm text-muted-foreground">Courses scheduled</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Total Credits</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">{timetableData.metadata.totalCredits}</p>
              <p className="text-sm text-muted-foreground">Credit hours</p>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Conflicts Resolved</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-success">{timetableData.metadata.conflictsResolved}</p>
              <p className="text-sm text-muted-foreground">Auto-resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={exportToPDF}
            disabled={isExporting}
            className="bg-destructive hover:bg-destructive/90 text-white px-6"
          >
            {isExporting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>

          <Button
            onClick={exportToExcel}
            disabled={isExporting}
            variant="outline"
            className="border-accent text-accent hover:bg-accent hover:text-white px-6"
          >
            {isExporting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </>
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            className="px-6"
          >
            <Link to="/form">
              <RotateCcw className="mr-2 h-4 w-4" />
              Generate New
            </Link>
          </Button>
        </div>

        {/* Timetable Display */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <TimetableCard timetableData={timetableData} />
        </div>

        {/* Additional Info */}
        <Card className="mt-8 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="text-center">Timetable Notes</CardTitle>
            <CardDescription className="text-center">
              Important information about your generated timetable
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 text-success mr-2" />
                  Features Included
                </h4>
                <ul className="text-muted-foreground space-y-1 ml-6">
                  <li>• NEP 2020 compliant structure</li>
                  <li>• Conflict-free scheduling</li>
                  <li>• Preference-based optimization</li>
                  <li>• Balanced course distribution</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 text-warning mr-2" />
                  Important Notes
                </h4>
                <ul className="text-muted-foreground space-y-1 ml-6">
                  <li>• Verify room availability with administration</li>
                  <li>• Check faculty availability before finalizing</li>
                  <li>• Keep backup options for critical courses</li>
                  <li>• Contact academic office for any changes</li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Generated on {new Date(timetableData.metadata.generatedAt).toLocaleString()} using AI optimization algorithms
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimetableResult;