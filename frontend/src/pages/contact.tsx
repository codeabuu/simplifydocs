import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Mail, MapPin, Phone, BarChart2, LifeBuoy, Upload, Brain } from 'lucide-react';
import { sendContactMessage } from '@/lib/api';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendContactMessage(formData);
      
      if (response.success) {
        toast({
          title: "Message received!",
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Our AI specialists will review your inquiry and respond within 24 hours.</span>
            </div>
          ),
          className: "border-green-500 bg-green-50",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast({
          title: "Error sending message",
          description: response.error || "Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending your message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="pt-16">
      {/* Contact Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Support Options */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-semibold mb-6">How we can help</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Upload className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Data Upload Assistance</h3>
                    <p className="text-gray-600">Get help formatting and uploading your data files</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">AI Analysis Questions</h3>
                    <p className="text-gray-600">Learn how to get the most from our AI insights</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-700">Results Interpretation</h3>
                    <p className="text-gray-600">Understand and apply your AI-generated insights</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="inline-flex items-center justify-center">
            <Brain className="h-5 w-5 mr-2 text-black" />
            <span className="text-lg font-medium text-black/90">ASKANALYTIQ SUPPORT</span>
          </div>
                <p className="text-gray-600 mb-6">
                  Tell us what you're looking for. Our AI specialists will help you get the most from our platform.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="subject">What do you need help with?</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Data upload, analysis questions, etc."
                    required
                    className="mt-2"
                  />
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="message">Describe your data and goals</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What type of data are you working with? What insights are you hoping to discover?"
                    required
                    className="mt-2 min-h-[150px]"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                  {loading ? 'Connecting to AI specialists...' : 'Get our Assistance'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;