
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Building, FileText, Users, Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Tender {
  id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string;
  industry: string | null;
  status: string | null;
  created_at: string;
}

interface Company {
  id: string;
  name: string;
  industry: string | null;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view your dashboard",
          variant: "destructive",
        });
        return;
      }

      // Fetch user's company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (companyError) {
        console.error('Company fetch error:', companyError);
      } else {
        setCompany(companyData);

        // Fetch company's tenders
        const { data: tendersData, error: tendersError } = await supabase
          .from('tenders')
          .select('*')
          .eq('company_id', companyData.id)
          .order('created_at', { ascending: false });

        if (tendersError) {
          console.error('Tenders fetch error:', tendersError);
        } else {
          setTenders(tendersData || []);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "closed": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Not specified";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">TenderHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/browse">
                <Button variant="ghost">Browse Tenders</Button>
              </Link>
              <Link to="/companies">
                <Button variant="ghost">Companies</Button>
              </Link>
              <Button variant="outline">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {company?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your tenders and grow your business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenders.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">{tenders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Closed Tenders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenders.filter(t => t.status === 'closed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Industry</p>
                  <p className="text-2xl font-bold text-gray-900">{company?.industry || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenders">My Tenders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Tenders</CardTitle>
                <Link to="/create-tender">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tender
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {tenders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No tenders created yet</p>
                    <Link to="/create-tender">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Tender
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tenders.slice(0, 3).map((tender) => (
                      <div key={tender.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{tender.title}</h4>
                          <p className="text-sm text-gray-600">
                            {formatBudget(tender.budget_min, tender.budget_max)} • 
                            Deadline: {new Date(tender.deadline).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(tender.status || 'active')}>
                          {tender.status || 'active'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tenders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Tenders</h2>
              <Link to="/create-tender">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tender
                </Button>
              </Link>
            </div>
            
            {tenders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No tenders created yet</p>
                  <Link to="/create-tender">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Tender
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {tenders.map((tender) => (
                  <Card key={tender.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Budget: {formatBudget(tender.budget_min, tender.budget_max)}</span>
                            <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                            <span>Industry: {tender.industry || 'Not specified'}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(tender.status || 'active')}>
                            {tender.status || 'active'}
                          </Badge>
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
