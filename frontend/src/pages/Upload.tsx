import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Upload as UploadIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { scoreFile, type RiskCounts } from "@/lib/api";  // <-- updated path

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls")) {
        setFile(selectedFile);
      } else {
        toast.error("Please upload an Excel file (.xlsx or .xls)");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsProcessing(true);

    try {
      // Call Flask backend via helper
      const data = await scoreFile(file);

      // Store results for the Results page
      localStorage.setItem("riskCounts", JSON.stringify(data.risk_counts));
      localStorage.setItem("customers", JSON.stringify(data.customers));

      toast.success("Risk assessment complete!");
      navigate("/results");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Customer Risk Assessment
            </h2>
            <p className="text-muted-foreground">
              Upload your customer data Excel file to generate comprehensive risk analysis
            </p>
          </div>

          <Card className="shadow-elevated border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Upload Customer Data
              </CardTitle>
              <CardDescription>
                Excel file (.xlsx or .xls) containing customer financial information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    name="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="p-4 rounded-full bg-primary/10">
                      <UploadIcon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Excel files only (MAX. 10MB)
                      </p>
                    </div>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={!file || isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Analyze Risk Profile"}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 text-foreground">
                  Expected File Format:
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Customer ID, Customer Name</li>
                  <li>• Account Balance, Monthly Income, Outstanding Loans</li>
                  <li>• Credit Score, Late Payments, Account Age</li>
                </ul>
              </div>
              {/* Manual Entry Link */}
              <div className="mt-4 text-center text-xs text-muted-foreground">
              Or{" "}
              <Link to="/manual" className="text-primary underline font-medium">
                try a Manual Risk Check
              </Link>{" "}
              for a single customer profile.
            </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;
