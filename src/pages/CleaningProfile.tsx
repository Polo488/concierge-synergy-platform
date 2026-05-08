import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CleaningProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('06 12 34 56 78');
  const [iban, setIban] = useState('FR76 3000 1234 5678 9012 345');

  useEffect(() => { document.title = 'Mon profil'; }, []);

  return (
    <div className="space-y-4 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Mon profil
        </h1>
      </header>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {(user?.name || 'C').split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[15px] font-bold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Prestataire de ménage</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-[12px]">Nom complet</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[12px]">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[12px]">Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[12px]">IBAN</Label>
              <Input value={iban} onChange={(e) => setIban(e.target.value)} className="mt-1.5 font-mono text-[12px]" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast.success('Profil mis à jour')}>Enregistrer</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CleaningProfile;
