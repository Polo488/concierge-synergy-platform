
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuestExperienceSettings as SettingsType } from '@/types/guestExperience';
import { toast } from 'sonner';

interface GuestExperienceSettingsProps {
  settings: SettingsType;
  onUpdateSettings: (settings: SettingsType) => void;
}

export function GuestExperienceSettings({
  settings,
  onUpdateSettings,
}: GuestExperienceSettingsProps) {
  const handleSave = () => {
    toast.success('Paramètres enregistrés');
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>
            Configuration globale des messages automatiques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Activer les messages automatiques</Label>
              <p className="text-sm text-muted-foreground">
                Active ou désactive tous les envois automatiques
              </p>
            </div>
            <Switch
              checked={settings.enableAutoMessages}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, enableAutoMessages: checked })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Langue par défaut</Label>
              <Select 
                value={settings.defaultLanguage} 
                onValueChange={(value) => 
                  onUpdateSettings({ ...settings, defaultLanguage: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Nom de l'expéditeur</Label>
              <Input
                value={settings.defaultSenderName}
                onChange={(e) => 
                  onUpdateSettings({ ...settings, defaultSenderName: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Email de réponse (optionnel)</Label>
            <Input
              type="email"
              value={settings.defaultReplyTo || ''}
              onChange={(e) => 
                onUpdateSettings({ ...settings, defaultReplyTo: e.target.value })
              }
              placeholder="reply@example.com"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Heures silencieuses</CardTitle>
          <CardDescription>
            Période pendant laquelle aucun message ne sera envoyé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Début</Label>
              <Input
                type="time"
                value={settings.quietHoursStart || '22:00'}
                onChange={(e) => 
                  onUpdateSettings({ ...settings, quietHoursStart: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Fin</Label>
              <Input
                type="time"
                value={settings.quietHoursEnd || '08:00'}
                onChange={(e) => 
                  onUpdateSettings({ ...settings, quietHoursEnd: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Les messages programmés pendant cette période seront envoyés à la fin des heures silencieuses.
          </p>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres avancés</CardTitle>
          <CardDescription>
            Options de comportement des messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Accusés de lecture</Label>
              <p className="text-sm text-muted-foreground">
                Suivre si les messages email ont été ouverts
              </p>
            </div>
            <Switch
              checked={settings.enableReadReceipts}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, enableReadReceipts: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Réessayer les messages échoués</Label>
              <p className="text-sm text-muted-foreground">
                Retenter automatiquement l'envoi des messages en échec
              </p>
            </div>
            <Switch
              checked={settings.retryFailedMessages}
              onCheckedChange={(checked) => 
                onUpdateSettings({ ...settings, retryFailedMessages: checked })
              }
            />
          </div>

          {settings.retryFailedMessages && (
            <div>
              <Label>Nombre maximum de tentatives</Label>
              <Select 
                value={settings.maxRetries.toString()} 
                onValueChange={(value) => 
                  onUpdateSettings({ ...settings, maxRetries: parseInt(value) })
                }
              >
                <SelectTrigger className="mt-1 w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 tentative</SelectItem>
                  <SelectItem value="2">2 tentatives</SelectItem>
                  <SelectItem value="3">3 tentatives</SelectItem>
                  <SelectItem value="5">5 tentatives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}
