'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  ArrowLeft,
  Loader2,
  User,
  Building2,
  Phone,
  MapPin,
  CheckCircle,
  Camera,
  LogOut,
  Lock,
  Bell,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { logger } from '@/lib/logger';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Settings saved successfully!');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Delete account state
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    company_name: '',
    phone: '',
    location: '',
    is_business: false,
    avatar_url: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    new_chat: true,
    new_lead: true,
    new_message: true,
    weekly_digest: true,
    marketing: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/dashboard/settings');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData({
          email: user.email || '',
          company_name: profile.company_name || '',
          phone: profile.phone || '',
          location: profile.location || '',
          is_business: profile.is_business || false,
          avatar_url: profile.avatar_url || '',
        });

        const notifSettings = profile.notification_settings || {};
        setNotifications({
          new_chat: notifSettings.new_chat !== false,
          new_lead: notifSettings.new_lead !== false,
          new_message: notifSettings.new_message !== false,
          weekly_digest: notifSettings.weekly_digest !== false,
          marketing: notifSettings.marketing === true,
        });
      }

      setIsLoading(false);
    };

    fetchProfile();
  }, [router, supabase]);

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let avatarUrl = formData.avatar_url;

      // Upload new avatar if selected
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-images')
          .upload(fileName, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName);
          avatarUrl = publicUrl;
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name || null,
          phone: formData.phone || null,
          location: formData.location || null,
          is_business: formData.is_business,
          avatar_url: avatarUrl || null,
          notification_settings: notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (!error) {
        setFormData((prev) => ({ ...prev, avatar_url: avatarUrl }));
        setAvatarFile(null);
        setAvatarPreview(null);
        showSuccessToast('Settings saved successfully!');
      }
    } catch (error) {
      logger.error('Save error', { error });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordData({ newPassword: '', confirmPassword: '' });
        showSuccessToast('Password updated successfully!');
      }
    } catch (error) {
      logger.error('Password change error', { error });
      setPasswordError('An unexpected error occurred');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      });

      if (res.ok) {
        await supabase.auth.signOut();
        router.push('/?deleted=true');
      }
    } catch (error) {
      logger.error('Delete account error', { error });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile
            </CardTitle>
            <CardDescription>
              Your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarPreview || formData.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {(formData.company_name || formData.email)?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="w-4 h-4" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <p className="font-medium">Profile Photo</p>
                <p className="text-sm text-muted-foreground">
                  Click the camera icon to upload
                </p>
              </div>
            </div>

            <Separator />

            {/* Email (read-only) */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Company Name */}
            <div>
              <Label htmlFor="company_name" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company / Display Name
              </Label>
              <Input
                id="company_name"
                placeholder="Your company or display name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Business Status */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">Business Account</p>
                <p className="text-sm text-muted-foreground">
                  {formData.is_business
                    ? 'Your account is verified for business features'
                    : 'Upgrade to a business account for additional features'}
                </p>
              </div>
              {formData.is_business ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Verified
                </span>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/get-started">Upgrade</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {passwordError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {passwordError}
              </div>
            )}

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="At least 8 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              variant="outline"
            >
              {isChangingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what email notifications you receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">New chat conversations</p>
                <p className="text-sm text-muted-foreground">When a visitor starts a chat on your storefront</p>
              </div>
              <Switch
                checked={notifications.new_chat}
                onCheckedChange={(checked) => setNotifications({ ...notifications, new_chat: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">New leads</p>
                <p className="text-sm text-muted-foreground">When a buyer submits a contact form or AI captures a lead</p>
              </div>
              <Switch
                checked={notifications.new_lead}
                onCheckedChange={(checked) => setNotifications({ ...notifications, new_lead: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">New messages</p>
                <p className="text-sm text-muted-foreground">When a buyer sends you a direct message</p>
              </div>
              <Switch
                checked={notifications.new_message}
                onCheckedChange={(checked) => setNotifications({ ...notifications, new_message: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">Weekly performance digest</p>
                <p className="text-sm text-muted-foreground">Summary of views, leads, and sales activity each week</p>
              </div>
              <Switch
                checked={notifications.weekly_digest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, weekly_digest: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-sm">Product updates & tips</p>
                <p className="text-sm text-muted-foreground">New features, selling tips, and marketplace news</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Sign out of your account on this device
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3">
                      <span className="block">This action cannot be undone. This will permanently delete:</span>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Your business profile and storefront</li>
                        <li>All your listings and images</li>
                        <li>All leads, deals, and conversation history</li>
                        <li>Your AI assistant configuration</li>
                      </ul>
                      <span className="block mt-4">
                        Type <strong>DELETE</strong> to confirm:
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="mt-2"
                  />
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Delete My Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
