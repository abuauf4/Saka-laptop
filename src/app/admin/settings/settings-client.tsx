// ─── Nauka CMS — Settings Management Client Component ───

"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Map,
  BarChart3,
  Share2,
  Server,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/auth-store";

// ─── Types ───

interface SettingsData {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  googleMapsUrl: string | null;
  googleAnalyticsId: string | null;
  metaPixelId: string | null;
  googleAdsId: string | null;
  gtmContainerId: string | null;
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUsername: string | null;
  smtpPassword: string | null;
  maintenanceMode: boolean;
}

export function SettingsClient() {
  const { hasPermission } = useAuthStore();

  const canView = hasPermission("settings.view");
  const canUpdate = hasPermission("settings.update");

  // Settings state
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Form state
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [metaPixelId, setMetaPixelId] = useState("");
  const [googleAdsId, setGoogleAdsId] = useState("");
  const [gtmContainerId, setGtmContainerId] = useState("");

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUsername, setSmtpUsername] = useState("");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // ─── Fetch settings ───
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setGoogleMapsUrl(data.googleMapsUrl || "");
        setGoogleAnalyticsId(data.googleAnalyticsId || "");
        setMetaPixelId(data.metaPixelId || "");
        setGoogleAdsId(data.googleAdsId || "");
        setGtmContainerId(data.gtmContainerId || "");
        setSmtpHost(data.smtpHost || "");
        setSmtpPort(data.smtpPort || "");
        setSmtpUsername(data.smtpUsername || "");
        setSmtpPassword(data.smtpPassword || "");
        setMaintenanceMode(data.maintenanceMode || false);
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ─── Save section ───
  const saveSection = async (section: string, data: Record<string, unknown>) => {
    if (!canUpdate) {
      toast.error("You don't have permission to update settings");
      return;
    }
    setSaving((prev) => ({ ...prev, [section]: true }));
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        toast.success(`${section} settings saved`);
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to save ${section.toLowerCase()} settings`);
      }
    } catch {
      toast.error(`Failed to save ${section.toLowerCase()} settings`);
    } finally {
      setSaving((prev) => ({ ...prev, [section]: false }));
    }
  };

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        You don&apos;t have permission to view settings
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your website settings and integrations</p>
      </div>

      <div className="grid gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                  <CardDescription>Phone, email, and address details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageCircle className="h-3 w-3" /> WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="+1 (555) 000-0000"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settingsEmail" className="flex items-center gap-2">
                  <Mail className="h-3 w-3" /> Email
                </Label>
                <Input
                  id="settingsEmail"
                  type="email"
                  placeholder="contact@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="123 Main Street, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="border-white/10 bg-white/5 resize-none"
                  disabled={!canUpdate}
                />
              </div>
              {canUpdate && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSection("Contact", { phone, whatsapp, email, address })}
                    disabled={saving["Contact"]}
                  >
                    {saving["Contact"] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Maps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-sky-500/10 flex items-center justify-center">
                  <Map className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Maps</CardTitle>
                  <CardDescription>Google Maps integration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleMapsUrl">Google Maps Embed URL</Label>
                <Input
                  id="googleMapsUrl"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
                <p className="text-xs text-muted-foreground">
                  Paste your Google Maps embed URL. You can get this from Google Maps → Share → Embed a map.
                </p>
              </div>
              {canUpdate && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSection("Maps", { googleMapsUrl })}
                    disabled={saving["Maps"]}
                  >
                    {saving["Maps"] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Maps
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Integrations</CardTitle>
                  <CardDescription>Analytics and tracking</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId" className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3" /> Google Analytics ID
                </Label>
                <Input
                  id="googleAnalyticsId"
                  placeholder="G-XXXXXXXXXX"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
                <p className="text-xs text-muted-foreground">
                  Your Google Analytics Measurement ID (e.g., G-ABC123DEF4). Used to track website visitors and page views.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaPixelId" className="flex items-center gap-2">
                  <Share2 className="h-3 w-3" /> Meta Pixel ID
                </Label>
                <Input
                  id="metaPixelId"
                  placeholder="1234567890"
                  value={metaPixelId}
                  onChange={(e) => setMetaPixelId(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
                <p className="text-xs text-muted-foreground">
                  Your Meta (Facebook) Pixel ID. Used for tracking conversions and retargeting ads on Facebook/Instagram.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="googleAdsId" className="flex items-center gap-2">
                  <Target className="h-3 w-3" /> Google Ads ID
                </Label>
                <Input
                  id="googleAdsId"
                  placeholder="AW-XXXXXXXXX"
                  value={googleAdsId}
                  onChange={(e) => setGoogleAdsId(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
                <p className="text-xs text-muted-foreground">
                  Your Google Ads conversion ID (e.g., AW-123456789). Used for tracking Google Ads conversions.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gtmContainerId" className="flex items-center gap-2">
                  <Code className="h-3 w-3" /> Google Tag Manager Container ID
                </Label>
                <Input
                  id="gtmContainerId"
                  placeholder="GTM-XXXXXXX"
                  value={gtmContainerId}
                  onChange={(e) => setGtmContainerId(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
                <p className="text-xs text-muted-foreground">
                  Your GTM Container ID (e.g., GTM-ABCDEF). If set, this will override GA, Google Ads, and Meta Pixel — manage all tags from GTM dashboard.
                </p>
              </div>
              {canUpdate && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSection("Integrations", { googleAnalyticsId, metaPixelId, googleAdsId, gtmContainerId })}
                    disabled={saving["Integrations"]}
                  >
                    {saving["Integrations"] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Integrations
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Email Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="border-white/5 bg-white/[0.02]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Server className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Email Configuration</CardTitle>
                  <CardDescription>SMTP settings for sending emails</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.example.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    className="border-white/10 bg-white/5"
                    disabled={!canUpdate}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  placeholder="user@example.com"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  className="border-white/10 bg-white/5"
                  disabled={!canUpdate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <div className="relative">
                  <Input
                    id="smtpPassword"
                    type={showSmtpPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={smtpPassword}
                    onChange={(e) => setSmtpPassword(e.target.value)}
                    className="border-white/10 bg-white/5 pr-10"
                    disabled={!canUpdate}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                  >
                    {showSmtpPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              {canUpdate && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => saveSection("Email", { smtpHost, smtpPort, smtpUsername, smtpPassword })}
                    disabled={saving["Email"]}
                  >
                    {saving["Email"] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Email Config
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Maintenance Mode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className={`border-white/5 bg-white/[0.02] ${maintenanceMode ? "border-amber-500/30" : ""}`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${maintenanceMode ? "bg-amber-500/20" : "bg-zinc-500/10"}`}>
                  <AlertTriangle className={`h-4 w-4 ${maintenanceMode ? "text-amber-400" : "text-zinc-400"}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">Maintenance Mode</CardTitle>
                  <CardDescription>Control website availability</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-white/5 p-4">
                <div className="space-y-1">
                  <p className="font-medium text-sm">
                    {maintenanceMode ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {maintenanceMode
                      ? "Your website is currently inaccessible to visitors"
                      : "Your website is live and accessible to visitors"}
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={(checked) => {
                    if (canUpdate) {
                      setMaintenanceMode(checked);
                      saveSection("Maintenance", { maintenanceMode: checked });
                    }
                  }}
                  disabled={!canUpdate}
                />
              </div>
              {maintenanceMode && (
                <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-400">Warning</p>
                    <p className="text-xs text-amber-400/80 mt-1">
                      Enabling maintenance mode will make the website inaccessible to visitors. Only
                      administrators can access the site while maintenance mode is active.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
