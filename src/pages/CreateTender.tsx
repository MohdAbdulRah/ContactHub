
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CreateTender = () => {
  const [loading, setLoading] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    industry: "",
    budget_min: "",
    budget_max: "",
    deadline: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkCompanyProfile();
  }, []);

  const checkCompanyProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create a tender",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Check if user has a company profile
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id, name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (companyError) {
        console.error('Company fetch error:', companyError);
        // Try to create a company profile automatically
        await createCompanyProfile(user.id);
      } else if (!companyData) {
        // Create company profile if it doesn't exist
        await createCompanyProfile(user.id);
      } else {
        setHasCompany(true);
      }
    } catch (error) {
      console.error('Error checking company profile:', error);
      toast({
        title: "Error",
        description: "Failed to verify company profile",
        variant: "destructive",
      });
    } finally {
      setCheckingCompany(false);
    }
  };

  const createCompanyProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert({
          user_id: userId,
          name: 'My Company',
          industry: 'Technology',
          description: 'Company description'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating company profile:', error);
        toast({
          title: "Error",
          description: "Failed to create company profile. Please try again.",
          variant: "destructive",
        });
      } else {
        setHasCompany(true);
        toast({
          title: "Company Profile Created",
          description: "A basic company profile has been created for you.",
        });
      }
    } catch (error) {
      console.error('Error creating company profile:', error);
      toast({
        title: "Error",
        description: "Failed to create company profile",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create a tender",
          variant: "destructive",
        });
        return;
      }

      // Get user's company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (companyError) {
        toast({
          title: "Error",
          description: "Failed to find your company profile",
          variant: "destructive",
        });
        return;
      }

      // Create tender
      const { data, error } = await supabase
        .from('tenders')
        .insert({
          company_id: companyData.id,
          title: formData.title,
          description: formData.description,
          industry: formData.industry || null,
          budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
          budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
          deadline: formData.deadline,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Tender created successfully!",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TenderHub</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Tender</h1>
          <p className="text-gray-600">Post a new tender to find the right partners</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Tender Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Cloud Infrastructure Migration"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project requirements, goals, and expectations..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select onValueChange={(value) => setFormData({...formData, industry: value})} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget_min">Minimum Budget ($)</Label>
                  <Input
                    id="budget_min"
                    type="number"
                    placeholder="e.g., 10000"
                    value={formData.budget_min}
                    onChange={(e) => setFormData({...formData, budget_min: e.target.value})}
                    disabled={loading}
                    min="0"
                    step="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget_max">Maximum Budget ($)</Label>
                  <Input
                    id="budget_max"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.budget_max}
                    onChange={(e) => setFormData({...formData, budget_max: e.target.value})}
                    disabled={loading}
                    min="0"
                    step="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  required
                  disabled={loading}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !hasCompany}>
                {loading ? "Creating Tender..." : "Create Tender"}
              </Button>
              
              {!hasCompany && (
                <p className="text-sm text-red-600 text-center">
                  Setting up your company profile...
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTender;
