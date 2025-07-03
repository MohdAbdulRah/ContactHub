
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Search, Filter, MapPin, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const mockCompanies = [
    {
      id: 1,
      name: "TechInnovate Solutions",
      industry: "Technology",
      location: "San Francisco, CA",
      employees: "50-100",
      description: "Leading provider of cloud computing and AI solutions for enterprise clients.",
      logo: "/api/placeholder/80/80",
      website: "www.techinnovate.com",
      activeTenders: 3,
      completedProjects: 45,
      rating: 4.8,
      services: ["Cloud Migration", "AI Development", "Software Consulting"]
    },
    {
      id: 2,
      name: "BuildCraft Construction",
      industry: "Construction",
      location: "Austin, TX",
      employees: "100-250",
      description: "Full-service construction company specializing in commercial and residential projects.",
      logo: "/api/placeholder/80/80",
      website: "www.buildcraft.com",
      activeTenders: 5,
      completedProjects: 120,
      rating: 4.6,
      services: ["Commercial Construction", "Renovation", "Project Management"]
    },
    {
      id: 3,
      name: "HealthTech Analytics",
      industry: "Healthcare",
      location: "Boston, MA",
      employees: "25-50",
      description: "Healthcare data analytics and EMR integration specialists.",
      logo: "/api/placeholder/80/80",
      website: "www.healthtechanalytics.com",
      activeTenders: 2,
      completedProjects: 28,
      rating: 4.9,
      services: ["Data Analytics", "EMR Integration", "Healthcare IT"]
    },
    {
      id: 4,
      name: "FinanceForward Consulting",
      industry: "Finance",
      location: "New York, NY",
      employees: "10-25",
      description: "Financial consulting and audit services for startups and SMEs.",
      logo: "/api/placeholder/80/80",
      website: "www.financeforward.com",
      activeTenders: 1,
      completedProjects: 67,
      rating: 4.7,
      services: ["Financial Audit", "Tax Consulting", "Investment Advisory"]
    },
    {
      id: 5,
      name: "GreenManufacturing Co",
      industry: "Manufacturing",
      location: "Detroit, MI",
      employees: "250-500",
      description: "Sustainable manufacturing solutions and equipment installation.",
      logo: "/api/placeholder/80/80",
      website: "www.greenmanufacturing.com",
      activeTenders: 4,
      completedProjects: 89,
      rating: 4.5,
      services: ["Equipment Installation", "Process Optimization", "Sustainability Consulting"]
    },
    {
      id: 6,
      name: "RetailBoost Marketing",
      industry: "Marketing",
      location: "Los Angeles, CA",
      employees: "15-30",
      description: "Digital marketing agency focused on retail and e-commerce brands.",
      logo: "/api/placeholder/80/80",
      website: "www.retailboost.com",
      activeTenders: 6,
      completedProjects: 156,
      rating: 4.4,
      services: ["Digital Marketing", "E-commerce Strategy", "Social Media Management"]
    }
  ];

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesIndustry = !selectedIndustry || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
  };

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
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/browse">
                <Button variant="ghost">Browse Tenders</Button>
              </Link>
              <Button variant="outline">Profile</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Directory</h1>
          <p className="text-gray-600">Discover and connect with potential business partners</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search companies by name, services, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Construction">Construction</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCompanies.length} of {mockCompanies.length} companies
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                      {getInitials(company.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1">{company.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{company.industry}</Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {company.location}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {company.employees}
                      </div>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">{getRatingStars(company.rating)}</span>
                        <span>{company.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{company.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {company.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {company.services.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.services.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>{company.activeTenders} Active Tenders</span>
                  <span>{company.completedProjects} Completed</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" className="flex-1">
                    Contact
                  </Button>
                </div>

                {company.website && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center text-sm text-blue-600">
                      <Globe className="h-3 w-3 mr-1" />
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {company.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Load More Companies</Button>
        </div>
      </div>
    </div>
  );
};

export default Companies;
