import { useEffect, useState } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend service
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Nous Contacter"
        description="Contactez l'équipe de Mobile Maroc pour toute question ou assistance. Nous sommes là pour vous aider."
        canonical="/contact"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nous Contacter
          </h1>
          <p className="text-xl text-gray-600">
            Avez-vous des questions ? Notre équipe d'assistance est là pour vous aider.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Pour les demandes générales :</p>
                <a href="mailto:info@mobilemaroc.ma" className="text-blue-600 font-semibold hover:underline">
                  info@mobilemaroc.ma
                </a>
                <p className="text-gray-600 mt-4 mb-2">Pour le support technique :</p>
                <a href="mailto:support@mobilemaroc.ma" className="text-blue-600 font-semibold hover:underline">
                  support@mobilemaroc.ma
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Phone className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Téléphone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Service Client :</p>
                <a href="tel:+212522123456" className="text-blue-600 font-semibold hover:underline">
                  +212 5 22 12 34 56
                </a>
                <p className="text-gray-600 mt-4 mb-2">WhatsApp Business :</p>
                <a href="https://wa.me/212522123456" className="text-blue-600 font-semibold hover:underline">
                  +212 5 22 12 34 56
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Casablanca, Maroc<br/>
                  Centre d'Affaires, Rue de la Liberté<br/>
                  Casablanca 20000
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Horaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Lundi - Vendredi : 9h00 - 18h00<br/>
                  Samedi : 10h00 - 16h00<br/>
                  Dimanche : Fermé
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Envoyez-nous un Message</h2>
          
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
            </div>
          )}

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom Complet *
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+212 5 XX XX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Sujet de votre message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Votre message..."
                    rows={6}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Envoyer le Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions Fréquentes</h3>
            <ul className="space-y-3 text-gray-600">
              <li>• <strong>Temps de réponse :</strong> Nous répondons généralement en 24 heures</li>
              <li>• <strong>Statut de livraison :</strong> Contactez notre équipe support via l'email associé à votre compte</li>
              <li>• <strong>Réclamations :</strong> Veuillez fournir des détails et photos si nécessaire</li>
              <li>• <strong>Partenariats :</strong> Écrivez à partnerships@mobilemaroc.ma</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Notre Localisation</h2>
          <div className="bg-gray-300 rounded-lg overflow-hidden h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.1463946826206!2d-7.589474!3d33.5731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d281a5e5e5e5d%3A0x1234567890abc!2sCasablanca%2C%20Morocco!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
