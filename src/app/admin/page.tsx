"use client";

import { useState, useEffect } from "react";
import { 
  Lock, Trash2, Plus, Calendar as CalendarIcon, Users, Image as ImageIcon, 
  Award, LayoutDashboard, LogOut, Newspaper, BarChart3, Download, Upload, 
  RotateCcw, Edit3, Check, X, Shield, Sparkles, ExternalLink, FileText, CheckCircle2,
  Search, Copy, Eye, SlidersHorizontal, RefreshCw, EyeOff, Star, Mail, Clock
} from "lucide-react";
import { 
  DataStore, EventItem, TeamMemberItem, LegacyHeadItem, SubTeamItem, 
  CoreValueItem, NewsIssueItem, GalleryItem, ClubStats, SubscriberItem
} from "@/lib/dataStore";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { compressImageFile } from "@/lib/imageCompressor";

type ActiveTab = "dashboard" | "events" | "team" | "about" | "legacy" | "news" | "gallery" | "stats" | "subscribers";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>("all");
  const [teamRoleFilter, setTeamRoleFilter] = useState<string>("all");
  const [teamDomainFilter, setTeamDomainFilter] = useState<string>("all");
  const [gallerySizeFilter, setGallerySizeFilter] = useState<string>("all");

  // Dynamic CMS States
  // Dynamic CMS States (Initialized with 0ms Sync Cache)
  const [events, setEvents] = useState<EventItem[]>(() => DataStore.getEventsSync());
  const [team, setTeam] = useState<TeamMemberItem[]>(() => DataStore.getTeamSync());
  const [legacyHeads, setLegacyHeads] = useState<LegacyHeadItem[]>(() => DataStore.getLegacyHeadsSync());
  const [subTeams, setSubTeams] = useState<SubTeamItem[]>(() => DataStore.getSubTeamsSync());
  const [coreValues, setCoreValues] = useState<CoreValueItem[]>(() => DataStore.getCoreValuesSync());
  const [newsIssues, setNewsIssues] = useState<NewsIssueItem[]>(() => DataStore.getNewsIssuesSync());
  const [gallery, setGallery] = useState<GalleryItem[]>(() => DataStore.getGallerySync());
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(() => DataStore.getSubscribersSync());
  const [stats, setStats] = useState<ClubStats>(() => DataStore.getStatsSync());

  // Modal / Form States
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [aboutSubTab, setAboutSubTab] = useState<"subteams" | "corevalues">("subteams");

  // Item Specific Form States
  const [eventForm, setEventForm] = useState<Partial<EventItem>>({});
  const [teamForm, setTeamForm] = useState<Partial<TeamMemberItem> & { skillsText?: string }>({});
  const [legacyForm, setLegacyForm] = useState<Partial<LegacyHeadItem>>({});
  const [subTeamForm, setSubTeamForm] = useState<Partial<SubTeamItem> & { pointsText?: string }>({});
  const [coreValueForm, setCoreValueForm] = useState<Partial<CoreValueItem> & { pointsText?: string }>({});
  const [newsForm, setNewsForm] = useState<Partial<NewsIssueItem> & { topicsText?: string }>({});
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({});
  const [gallerySelectedFile, setGallerySelectedFile] = useState<File | null>(null);
  const [teamSelectedFile, setTeamSelectedFile] = useState<File | null>(null);
  const [legacySelectedFile, setLegacySelectedFile] = useState<File | null>(null);
  const [eventSelectedFile, setEventSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Admin Security States
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Load from DataStore in Parallel
  const reloadData = async () => {
    const [
      evs,
      tm,
      leg,
      sub,
      core,
      news,
      gal,
      subs,
      st
    ] = await Promise.all([
      DataStore.getEvents(),
      DataStore.getTeam(),
      DataStore.getLegacyHeads(),
      DataStore.getSubTeams(),
      DataStore.getCoreValues(),
      DataStore.getNewsIssues(),
      DataStore.getGallery(),
      DataStore.getSubscribers(),
      DataStore.getStats()
    ]);
    setEvents(evs);
    setTeam(tm);
    setLegacyHeads(leg);
    setSubTeams(sub);
    setCoreValues(core);
    setNewsIssues(news);
    setGallery(gal);
    setSubscribers(subs);
    setStats(st);
  };

  useEffect(() => {
    // Check active session on load (Supabase session or active browser session token)
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hasLocalToken = typeof window !== "undefined" && sessionStorage.getItem("csi_admin_authenticated") === "true";
      
      if (session || hasLocalToken) {
        setIsAuthenticated(true);
        reloadData();
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const hasLocalToken = typeof window !== "undefined" && sessionStorage.getItem("csi_admin_authenticated") === "true";
      if (session || hasLocalToken) {
        setIsAuthenticated(true);
        reloadData();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLoginError("Please enter both Admin Email and Password.");
      return;
    }

    setIsLoggingIn(true);

    try {
      // 1. Primary Attempt: Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (!error && data?.session) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("csi_admin_authenticated", "true");
        }
        setIsAuthenticated(true);
        setPassword("");
        setIsLoggingIn(false);
        showToast("Signed in to Admin CMS successfully!");
        return;
      }

      // 2. Secondary Attempt: Fallback Master Passcode Check
      const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET || DataStore.getAdminPassword();
      const isMasterValid = cleanPassword === adminSecret || cleanPassword === DataStore.getAdminPassword();

      if (isMasterValid) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("csi_admin_authenticated", "true");
        }
        setIsAuthenticated(true);
        setPassword("");
        setIsLoggingIn(false);
        showToast("Signed in to Admin CMS successfully!");
        return;
      }

      // If both authentication checks fail
      setLoginError("Invalid credentials. Please verify your email and password.");
    } catch (err: any) {
      setLoginError("Authentication error: " + (err?.message || "Unable to sign in."));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      // ignore
    }
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("csi_admin_authenticated");
    }
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    showToast("Signed out of Admin CMS.");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    try {
      // Try updating Supabase Auth user password if logged in via Supabase
      await supabase.auth.updateUser({ password: newPassword.trim() });
    } catch (err) {
      console.warn("Supabase auth password update skipped:", err);
    }

    DataStore.saveAdminPassword(newPassword.trim());
    setNewPassword("");
    setShowPasswordChange(false);
    showToast("Admin master password updated successfully!");
  };

  // --- EXPORT & IMPORT BACKUP --- //
  const handleExportBackup = async () => {
    const backup = await DataStore.exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csi_srmcem_decoders_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Full backup JSON exported successfully!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (await DataStore.importBackup(parsed)) {
          await reloadData();
          showToast("Data backup restored successfully!");
        } else {
          alert("Invalid backup file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = async () => {
    if (confirm("Are you sure you want to reset all data to official defaults? This will erase custom additions.")) {
      await DataStore.resetToDefaults();
      await reloadData();
      showToast("Reset to official defaults complete!");
    }
  };

  // --- EVENTS CRUD --- //
  const openEventModal = (item?: EventItem) => {
    setEventSelectedFile(null);
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setEventForm({
        ...item,
        isFeatured: item.isFeatured ?? (item.category === "upcoming" || item.category === "current")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setEventForm({
        title: "",
        date: "",
        time: "",
        location: "SRMCEM Campus",
        category: "upcoming",
        color: "sky",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400",
        description: "",
        registrationUrl: "https://forms.google.com",
        isFeatured: true
      });
    }
  };

  const handleFileUpload = async (file: File, folder: string = "gallery"): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.url) {
          return result.url;
        }
      }
    } catch (err) {
      console.warn("API upload fetch notice (falling back to WebP Base64 compression):", err);
    }
    try {
      // Compress uploaded image file to lightweight WebP data URL (~30KB-50KB)
      const compressedWebP = await compressImageFile(file, {
        maxWidth: folder === "events" || folder === "gallery" ? 800 : 400,
        maxHeight: folder === "events" || folder === "gallery" ? 800 : 400,
        quality: 0.75
      });
      return compressedWebP;
    } catch (err) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date) return;

    let finalImageUrl = (eventForm.image || "").trim() || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=400";
    if (eventSelectedFile) {
      setIsUploading(true);
      finalImageUrl = await handleFileUpload(eventSelectedFile, "events");
    }
    setIsUploading(false);

    let updated: EventItem[];
    const isAutoFeatured = eventForm.isFeatured !== undefined 
      ? eventForm.isFeatured 
      : (eventForm.category === "upcoming" || eventForm.category === "current");

    if (modalMode === "edit" && editingId) {
      updated = events.map(ev => ev.id === editingId ? { ...ev, ...eventForm, image: finalImageUrl, isFeatured: isAutoFeatured } as EventItem : ev);
    } else {
      const newItem: EventItem = {
        id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: eventForm.title || "Untitled Event",
        date: eventForm.date || "TBD",
        time: eventForm.time || "TBD",
        location: eventForm.location || "SRMCEM",
        category: (eventForm.category as any) || "upcoming",
        color: (eventForm.color as any) || "sky",
        image: finalImageUrl,
        description: eventForm.description || "",
        registrationUrl: eventForm.registrationUrl || "",
        isFeatured: isAutoFeatured
      };
      updated = [newItem, ...events];
    }
    setEvents(updated);
    setModalMode(null);
    showToast("Saving event to database...");
    await DataStore.saveEvents(updated);
    showToast("Event saved successfully & updated live across website!");
  };

  const handleEventCategoryChange = async (id: string, newCategory: "upcoming" | "current" | "past") => {
    const updated = events.map(ev => {
      if (ev.id === id) {
        const shouldBeFeatured = newCategory === "upcoming" || newCategory === "current" ? true : ev.isFeatured;
        return { ...ev, category: newCategory, isFeatured: shouldBeFeatured };
      }
      return ev;
    });
    setEvents(updated);
    showToast(`Updating status to "${newCategory}"...`);
    await DataStore.saveEvents(updated);
    showToast(`Event status updated to "${newCategory}"!`);
  };

  const handleToggleEventFeatured = async (id: string) => {
    const updated = events.map(ev => ev.id === id ? { ...ev, isFeatured: !ev.isFeatured } : ev);
    setEvents(updated);
    showToast("Updating featured status...");
    await DataStore.saveEvents(updated);
    showToast("Homepage featured status updated live!");
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const updated = events.filter(ev => ev.id !== id);
    setEvents(updated);
    showToast("Deleting event...");
    await DataStore.saveEvents(updated);
    showToast("Event deleted.");
  };

  // --- TEAM CRUD --- //
  const openTeamModal = (item?: TeamMemberItem) => {
    setTeamSelectedFile(null);
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setTeamForm({
        ...item,
        skillsText: item.skills.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setTeamForm({
        name: "",
        position: "CORE COMMITTEE MEMBER",
        branch: "",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: "",
        level: 5,
        domain: "technical",
        skillsText: "Development, Problem Solving",
        socials: { linkedin: "https://linkedin.com", github: "https://github.com", email: "" }
      });
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.position) return;
    const skillsArray = (teamForm.skillsText || "")
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    let finalImageUrl = (teamForm.image || "").trim() || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";

    if (teamSelectedFile) {
      setIsUploading(true);
      finalImageUrl = await handleFileUpload(teamSelectedFile, "team");
    }
    
    setIsUploading(false);

    const cleanSocials = {
      linkedin: teamForm.socials?.linkedin?.trim() || undefined,
      github: teamForm.socials?.github?.trim() || undefined,
      email: teamForm.socials?.email?.trim() || undefined,
    };

    let updated: TeamMemberItem[];
    if (modalMode === "edit" && editingId) {
      const { skillsText, ...cleanTeamForm } = teamForm;
      updated = team.map(m => m.id === editingId ? {
        ...m,
        ...cleanTeamForm,
        name: teamForm.name || m.name,
        position: teamForm.position || m.position,
        level: teamForm.level || m.level || 5,
        domain: teamForm.domain || m.domain || "technical",
        branch: teamForm.branch ?? m.branch ?? "",
        bio: teamForm.bio ?? m.bio ?? "",
        image: finalImageUrl,
        skills: skillsArray,
        socials: cleanSocials
      } as TeamMemberItem : m);
    } else {
      const newItem: TeamMemberItem = {
        id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: teamForm.name || "",
        position: teamForm.position || "CORE COMMITTEE MEMBER",
        branch: teamForm.branch || "",
        image: finalImageUrl,
        bio: teamForm.bio || "",
        level: teamForm.level || 5,
        domain: teamForm.domain || "technical",
        skills: skillsArray,
        socials: cleanSocials
      };
      updated = [...team, newItem];
    }
    setTeam(updated);
    setModalMode(null);
    showToast("Saving team member...");
    await DataStore.saveTeam(updated);
    showToast("Team member saved successfully!");
  };

  const handleDuplicateTeam = async (item: TeamMemberItem) => {
    const duplicated: TeamMemberItem = {
      ...item,
      id: `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${item.name} (Copy)`
    };
    const updated = [...team, duplicated];
    setTeam(updated);
    showToast(`Duplicating ${item.name}...`);
    await DataStore.saveTeam(updated);
    showToast(`Duplicated ${item.name} successfully!`);
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const updated = team.filter(m => m.id !== id);
    setTeam(updated);
    showToast("Removing team member...");
    await DataStore.saveTeam(updated);
    showToast("Team member removed.");
  };

  // --- LEGACY (HALL OF FAME) CRUD --- //
  const openLegacyModal = (item?: LegacyHeadItem) => {
    setLegacySelectedFile(null);
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setLegacyForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setLegacyForm({
        name: "",
        role: "President (2022-2023)",
        tenure: "2022-2023",
        placedAt: "Google",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: "",
        highlight: "SDE @ Google • National Hackathons"
      });
    }
  };

  const handleSaveLegacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!legacyForm.name || !legacyForm.bio) return;

    setIsUploading(true);
    let finalImageUrl = (legacyForm.image || "").trim() || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400";

    if (legacySelectedFile) {
      finalImageUrl = await handleFileUpload(legacySelectedFile, "legacy");
    }

    let updated: LegacyHeadItem[];
    if (modalMode === "edit" && editingId) {
      updated = legacyHeads.map(l => l.id === editingId ? { ...l, ...legacyForm, image: finalImageUrl } as LegacyHeadItem : l);
    } else {
      const newItem: LegacyHeadItem = {
        id: `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: legacyForm.name || "",
        role: legacyForm.role || "Former Head",
        tenure: legacyForm.tenure || "Leadership & Guidance",
        placedAt: legacyForm.placedAt || "Top Placement",
        image: finalImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
        bio: legacyForm.bio || "",
        highlight: legacyForm.highlight || "Mentorship & Leadership"
      };
      updated = [...legacyHeads, newItem];
    }
    setLegacyHeads(updated);
    setModalMode(null);
    setIsUploading(false);
    showToast("Saving Hall of Fame leader...");
    await DataStore.saveLegacyHeads(updated);
    showToast("Hall of Fame leader saved successfully!");
  };

  const handleDeleteLegacy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alumni leader?")) return;
    const updated = legacyHeads.filter(l => l.id !== id);
    setLegacyHeads(updated);
    showToast("Removing alumni leader...");
    await DataStore.saveLegacyHeads(updated);
    showToast("Alumni leader removed.");
  };

  // --- ABOUT SUB-TEAMS CRUD --- //
  const openSubTeamModal = (item?: SubTeamItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setSubTeamForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setSubTeamForm({
        title: "",
        category: "Domain Wing",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Feature 1, Feature 2, Feature 3"
      });
    }
  };

  const handleSaveSubTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTeamForm.title || !subTeamForm.frontDesc) return;
    const pts = (subTeamForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: SubTeamItem[];
    if (modalMode === "edit" && editingId) {
      const { pointsText, ...cleanSubTeamForm } = subTeamForm;
      updated = subTeams.map(st => st.id === editingId ? {
        ...st,
        ...cleanSubTeamForm,
        points: pts
      } as SubTeamItem : st);
    } else {
      const newItem: SubTeamItem = {
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: subTeamForm.title || "",
        category: subTeamForm.category || "Domain Wing",
        color: (subTeamForm.color as any) || "sky",
        frontDesc: subTeamForm.frontDesc || "",
        backDesc: subTeamForm.backDesc || "",
        points: pts
      };
      updated = [...subTeams, newItem];
    }
    setSubTeams(updated);
    setModalMode(null);
    showToast("Saving Sub-Team domain...");
    await DataStore.saveSubTeams(updated);
    showToast("Sub-Team domain saved!");
  };

  const handleDeleteSubTeam = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sub-team?")) return;
    const updated = subTeams.filter(s => s.id !== id);
    setSubTeams(updated);
    showToast("Removing Sub-Team...");
    await DataStore.saveSubTeams(updated);
    showToast("Sub-Team removed.");
  };

  // --- ABOUT CORE VALUES CRUD --- //
  const openCoreValueModal = (item?: CoreValueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setCoreValueForm({
        ...item,
        pointsText: item.points.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setCoreValueForm({
        title: "",
        category: "Pillar",
        color: "sky",
        frontDesc: "",
        backDesc: "",
        pointsText: "Deliverable 1, Deliverable 2, Deliverable 3"
      });
    }
  };

  const handleSaveCoreValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coreValueForm.title || !coreValueForm.frontDesc) return;
    const pts = (coreValueForm.pointsText || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let updated: CoreValueItem[];
    if (modalMode === "edit" && editingId) {
      const { pointsText, ...cleanCoreValueForm } = coreValueForm;
      updated = coreValues.map(cv => cv.id === editingId ? {
        ...cv,
        ...cleanCoreValueForm,
        points: pts
      } as CoreValueItem : cv);
    } else {
      const newItem: CoreValueItem = {
        id: `cv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: coreValueForm.title || "",
        category: coreValueForm.category || "Pillar",
        color: (coreValueForm.color as any) || "sky",
        frontDesc: coreValueForm.frontDesc || "",
        backDesc: coreValueForm.backDesc || "",
        points: pts
      };
      updated = [...coreValues, newItem];
    }
    setCoreValues(updated);
    setModalMode(null);
    showToast("Saving Core Value pillar...");
    await DataStore.saveCoreValues(updated);
    showToast("Core Value pillar saved!");
  };

  const handleDeleteCoreValue = async (id: string) => {
    if (!confirm("Are you sure you want to delete this core value?")) return;
    const updated = coreValues.filter(c => c.id !== id);
    setCoreValues(updated);
    showToast("Removing Core Value...");
    await DataStore.saveCoreValues(updated);
    showToast("Core Value removed.");
  };

  // --- NEWS GAZETTE CRUD --- //
  const openNewsModal = (item?: NewsIssueItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setNewsForm({
        ...item,
        topicsText: item.topics.join(", ")
      });
    } else {
      setModalMode("add");
      setEditingId(null);
      setNewsForm({
        volume: "Vol. 08",
        month: "October",
        year: "2024",
        title: "Monthly Technical Gazette",
        description: "Official monthly technical gazette featuring project releases and spotlights.",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: "/documents/csi-gazette-october-2024.pdf",
        fileSize: "5.2 MB",
        pageCount: 16,
        topicsText: "Hackathons, Next.js, Cloud, Placements",
        isCurrent: false
      });
    }
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.pdfUrl) return;
    const topicsArray = (newsForm.topicsText || "")
      .split(",")
      .map(t => t.trim())
      .filter(t => t !== "");

    let updated: NewsIssueItem[];
    if (modalMode === "edit" && editingId) {
      const { topicsText, ...cleanNewsForm } = newsForm;
      updated = newsIssues.map(n => n.id === editingId ? {
        ...n,
        ...cleanNewsForm,
        pageCount: Number(cleanNewsForm.pageCount) || 16,
        topics: topicsArray,
        isCurrent: Boolean(cleanNewsForm.isCurrent)
      } as NewsIssueItem : (cleanNewsForm.isCurrent ? { ...n, isCurrent: false } : n));
    } else {
      const newItem: NewsIssueItem = {
        id: `news-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        volume: newsForm.volume || "Vol. 01",
        month: newsForm.month || "Current",
        year: newsForm.year || "2024",
        title: newsForm.title || "Monthly Gazette",
        description: newsForm.description || "",
        coverImage: newsForm.coverImage || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800&h=1000",
        pdfUrl: newsForm.pdfUrl || "",
        fileSize: newsForm.fileSize || "4.5 MB",
        pageCount: Number(newsForm.pageCount) || 12,
        topics: topicsArray,
        isCurrent: Boolean(newsForm.isCurrent)
      };

      if (newItem.isCurrent) {
        updated = [newItem, ...newsIssues.map(n => ({ ...n, isCurrent: false }))];
      } else {
        updated = [newItem, ...newsIssues];
      }
    }
    setNewsIssues(updated);
    setModalMode(null);
    showToast("Saving News Gazette edition...");
    await DataStore.saveNewsIssues(updated);
    showToast("News Gazette edition saved!");
  };

  const handleSetCurrentNews = async (id: string) => {
    const updated = newsIssues.map(n => ({
      ...n,
      isCurrent: n.id === id
    }));
    setNewsIssues(updated);
    showToast("Updating live edition...");
    await DataStore.saveNewsIssues(updated);
    showToast("Current live edition updated!");
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm("Are you sure you want to delete this edition?")) return;
    const updated = newsIssues.filter(n => n.id !== id);
    setNewsIssues(updated);
    showToast("Removing news edition...");
    await DataStore.saveNewsIssues(updated);
    showToast("News edition removed.");
  };

  // --- GALLERY CRUD --- //
  const openGalleryModal = (item?: GalleryItem) => {
    if (item) {
      setModalMode("edit");
      setEditingId(item.id);
      setGalleryForm(item);
    } else {
      setModalMode("add");
      setEditingId(null);
      setGalleryForm({
        title: "",
        detail: "",
        image: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800&h=800",
        size: "small"
      });
    }
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) return;
    if (!galleryForm.image && !gallerySelectedFile) return;

    setIsUploading(true);
    let finalImageUrl = galleryForm.image || "";

    if (gallerySelectedFile) {
      finalImageUrl = await handleFileUpload(gallerySelectedFile);
    }

    let updated: GalleryItem[];
    if (modalMode === "edit" && editingId) {
      updated = gallery.map(g => g.id === editingId ? { ...g, ...galleryForm, image: finalImageUrl } as GalleryItem : g);
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: galleryForm.title || "",
        detail: galleryForm.detail || "",
        image: finalImageUrl,
        size: (galleryForm.size as any) || "small"
      };
      updated = [newItem, ...gallery];
    }
    setGallery(updated);
    setGallerySelectedFile(null);
    setIsUploading(false);
    setModalMode(null);
    showToast("Saving gallery moment...");
    await DataStore.saveGallery(updated);
    showToast("Gallery moment saved!");
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    showToast("Removing gallery photo...");
    await DataStore.saveGallery(updated);
    showToast("Gallery photo removed.");
  };

  // --- STATS UPDATE --- //
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Saving homepage metrics...");
    await DataStore.saveStats(stats);
    showToast("Homepage metrics saved successfully & updated live!");
  };

  // --- SUBSCRIBER MANAGEMENT --- //
  const handleDeleteSubscriber = async (identifier: string) => {
    if (!confirm(`Are you sure you want to remove subscriber: ${identifier}?`)) return;
    setSubscribers(prev => prev.filter(s => s.id !== identifier && s.email !== identifier));
    showToast("Removing subscriber...");
    await DataStore.deleteSubscriber(identifier);
    showToast("Subscriber removed.");
  };

  const handleExportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export.");
      return;
    }
    const headers = "ID,Email,Date Subscribed\n";
    const rows = subscribers.map((s, idx) => `"${s.id || idx + 1}","${s.email}","${s.created_at || new Date().toISOString()}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `csi_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Subscribers list exported as CSV!");
  };

  // --- SEARCH & FILTER LOGIC --- //
  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = eventCategoryFilter === "all" || e.category === eventCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredTeam = team.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.skills && m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const posUpper = (m.position || "").toUpperCase();
    const lvl = m.level || (
      posUpper.includes("PRESIDENT") ? (posUpper.includes("VICE") ? 2 : 1) :
      posUpper.includes("HEAD") ? (posUpper.includes("CO-HEAD") || posUpper.includes("CO HEAD") ? 4 : 3) :
      5
    );

    const isExecutive = lvl === 1 || lvl === 2 || posUpper.includes("PRESIDENT") || posUpper.includes("VICE PRESIDENT");
    const isCore = (lvl === 3 || lvl === 4 || posUpper.includes("HEAD") || posUpper.includes("CO-HEAD") || posUpper.includes("LEAD")) && !isExecutive;
    const isGeneralMember = lvl >= 5 || posUpper.includes("MEMBER") || (!isExecutive && !isCore);

    const matchesRole = teamRoleFilter === "all" || 
      (teamRoleFilter === "executive" && isExecutive) ||
      (teamRoleFilter === "core" && isCore) ||
      (teamRoleFilter === "members" && isGeneralMember);

    const domStr = ((m.domain || "") + " " + (m.position || "")).toLowerCase();
    const memberDomain = 
      domStr.includes("tech") ? "technical" :
      (domStr.includes("design") || domStr.includes("ui/ux")) ? "designing" :
      domStr.includes("content") ? "content" :
      (/\bpr\b/.test(domStr) || domStr.includes("marketing") || domStr.includes("outreach")) ? "marketing" :
      (domStr.includes("photo") || domStr.includes("media")) ? "photography" :
      "executive";

    const matchesDomain = teamDomainFilter === "all" || memberDomain === teamDomainFilter;

    return matchesSearch && matchesRole && matchesDomain;
  }).sort((a, b) => {
    const posA = (a.position || "").toUpperCase();
    const posB = (b.position || "").toUpperCase();
    
    const lvlA = a.level || (
      posA.includes("PRESIDENT") ? (posA.includes("VICE") ? 2 : 1) :
      posA.includes("HEAD") ? (posA.includes("CO-HEAD") || posA.includes("CO HEAD") ? 4 : 3) : 5
    );
    const lvlB = b.level || (
      posB.includes("PRESIDENT") ? (posB.includes("VICE") ? 2 : 1) :
      posB.includes("HEAD") ? (posB.includes("CO-HEAD") || posB.includes("CO HEAD") ? 4 : 3) : 5
    );

    // 1. Leadership Rank Priority (Level 1: President, 2: VP, 3: Head, 4: Co-head, 5: Member)
    if (lvlA !== lvlB) {
      return lvlA - lvlB;
    }

    // 2. Alphabetical Sort A-Z by Name within same level
    return a.name.localeCompare(b.name);
  });

  const filteredLegacy = legacyHeads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.placedAt && l.placedAt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredSubTeams = subTeams.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.frontDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCoreValues = coreValues.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.frontDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = newsIssues.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.volume.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.month.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.year.includes(searchQuery)
  );

  const filteredGallery = gallery.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = gallerySizeFilter === "all" || g.size === gallerySizeFilter;
    return matchesSearch && matchesSize;
  });

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LOGIN VIEW --- //
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 blur-[80px] md:blur-[160px] opacity-60 md:opacity-100 rounded-full -z-10" />
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 p-8 sm:p-10 rounded-3xl w-full max-w-md shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1 tracking-tight">Admin CMS Portal</h2>
          <p className="text-slate-400 text-xs sm:text-sm text-center mb-6">
            CSI_SRMCEM X D&apos;CODERS Content Management System
          </p>

          {loginError && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@csisrmcem.org" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
                autoComplete="email"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-mono tracking-wider mb-4"
              />
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                  autoComplete="current-password"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to CMS</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Helper Sidebar Tab button
  const SidebarTab = ({ id, label, icon: Icon, count }: { id: ActiveTab; label: string; icon: any; count?: number }) => (
    <button 
      onClick={() => { setActiveTab(id); setModalMode(null); setSearchQuery(""); }}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm text-left group",
        activeTab === id 
          ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-bold" 
          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("w-4 h-4", activeTab === id ? "text-white" : "text-slate-400 group-hover:text-sky-400")} />
        <span>{label}</span>
      </div>
      {typeof count === "number" && (
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full font-mono font-bold",
          activeTab === id ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
        )}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Floating Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 sm:right-8 z-[200] bg-sky-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold animate-in fade-in slide-in-from-top-4 border border-sky-400/50">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================================================= */}
        {/* SIDEBAR NAVIGATION */}
        {/* ========================================================================= */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 bg-slate-900/60 p-5 rounded-3xl border border-slate-800 backdrop-blur-xl h-fit">
          <div className="mb-4 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1">
              Admin CMS Portal
            </span>
            <h2 className="text-xl font-extrabold text-white">
              CSI_SRMCEM X D&apos;CODERS
            </h2>
          </div>
          
          <div className="space-y-1">
            <SidebarTab id="dashboard" label="Overview" icon={LayoutDashboard} />
            <SidebarTab id="events" label="Events & Workshops" icon={CalendarIcon} count={events.length} />
            <SidebarTab id="team" label="Team Members" icon={Users} count={team.length} />
            <SidebarTab id="about" label="About & Ecosystem" icon={Sparkles} count={subTeams.length + coreValues.length} />
            <SidebarTab id="legacy" label="Hall of Fame & Alumni" icon={Award} count={legacyHeads.length} />
            <SidebarTab id="news" label="News & PDF Gazette" icon={Newspaper} count={newsIssues.length} />
            <SidebarTab id="subscribers" label="Subscribers & Mail" icon={Mail} count={subscribers.length} />
            <SidebarTab id="gallery" label="Gallery Moments" icon={ImageIcon} count={gallery.length} />
            <SidebarTab id="stats" label="Homepage Stats" icon={BarChart3} />
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 space-y-2">
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 hover:text-sky-300 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Change Password Dialog */}
          {showPasswordChange && (
            <form onSubmit={handleChangePassword} className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <input
                type="password"
                placeholder="New Master Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                required
              />
              <button type="submit" className="w-full py-1.5 bg-sky-500 text-white rounded-lg text-xs font-bold hover:bg-sky-400">
                Update Password
              </button>
            </form>
          )}
        </div>

        {/* ========================================================================= */}
        {/* MAIN CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-xl min-h-[650px] relative">
          
          {/* 1. OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">System Status: Live &amp; Synced</span>
                <h1 className="text-3xl font-extrabold text-white mt-1">Dashboard Overview</h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage all live content for CSI_SRMCEM X D&apos;CODERS. Changes save immediately to the live site.
                </p>
              </div>

              {/* Counters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div onClick={() => setActiveTab("events")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-sky-400 mb-1">{events.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Total Events</div>
                </div>
                <div onClick={() => setActiveTab("team")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-blue-400 mb-1">{team.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Team Members</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("subteams"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-purple-400 mb-1">{subTeams.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Sub-Teams</div>
                </div>
                <div onClick={() => { setActiveTab("about"); setAboutSubTab("corevalues"); }} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{coreValues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Core Values</div>
                </div>
                <div onClick={() => setActiveTab("legacy")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-indigo-400 mb-1">{legacyHeads.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Hall of Fame</div>
                </div>
                <div onClick={() => setActiveTab("news")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-sky-400 mb-1">{newsIssues.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">News Editions</div>
                </div>
                <div onClick={() => setActiveTab("gallery")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-pink-400 mb-1">{gallery.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Gallery Photos</div>
                </div>
                <div onClick={() => setActiveTab("subscribers")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-emerald-400 mb-1">{subscribers.length}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Subscribers</div>
                </div>
                <div onClick={() => setActiveTab("stats")} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:scale-[1.02]">
                  <div className="text-3xl font-black text-cyan-400 mb-1">{stats.placementRate}</div>
                  <div className="text-xs font-bold uppercase text-slate-400">Placement Rate</div>
                </div>
              </div>

              {/* Backup & System Tools */}
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-sky-400" />
                  <span>Data Backup, Export &amp; Reset</span>
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Export complete website data to a JSON file to create a backup, or restore data from a previous file.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleExportBackup}
                    className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-bold transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON Backup</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import JSON Backup</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>

                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all sm:ml-auto"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENTS MANAGER */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Events &amp; Workshops Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Add, edit, or delete flagship hackathons, bootcamps, and workshops.</p>
                </div>
                <button
                  onClick={() => openEventModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Event</span>
                </button>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search events by title, location, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  {["all", "upcoming", "current", "past"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setEventCategoryFilter(cat)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                        eventCategoryFilter === cat ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {cat === "all" ? "All Events" : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No events found matching your criteria.</div>
                ) : (
                  filteredEvents.map((ev) => (
                    <div key={ev.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-4">
                        <img src={ev.image} alt={ev.title} className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0" />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {/* 1-Click Status Dropdown */}
                            <select
                              value={ev.category}
                              onChange={(e) => handleEventCategoryChange(ev.id, e.target.value as any)}
                              className={cn(
                                "px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border bg-transparent cursor-pointer focus:outline-none",
                                ev.category === "upcoming" ? "bg-sky-500/20 text-sky-300 border-sky-500/30" :
                                ev.category === "current" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
                                "bg-slate-800 text-slate-400 border-slate-700"
                              )}
                            >
                              <option value="upcoming" className="bg-slate-900 text-sky-300">Upcoming</option>
                              <option value="current" className="bg-slate-900 text-emerald-300">Current / Live</option>
                              <option value="past" className="bg-slate-900 text-slate-400">Past</option>
                            </select>
                            <span className="text-xs text-slate-400 font-mono">{ev.date} • {ev.time}</span>
                            <span className="text-xs text-slate-500">• {ev.location}</span>
                            {ev.registrationUrl && ev.registrationUrl !== "#" ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                                🔗 Reg Link Active
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
                                No Link
                              </span>
                            )}
                            {ev.isFeatured ? (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1">
                                ⭐ Featured
                              </span>
                            ) : null}
                          </div>
                          <h4 className="text-base font-bold text-white">{ev.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{ev.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleEventFeatured(ev.id)}
                          className={cn(
                            "p-2 rounded-lg transition-all text-xs font-mono font-bold flex items-center gap-1 border",
                            ev.isFeatured 
                              ? "bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25" 
                              : "bg-slate-800/80 text-slate-400 border-slate-700 hover:text-amber-300 hover:border-amber-500/30"
                          )}
                          title="Toggle Featured Highlight on Homepage"
                        >
                          <Star className={cn("w-3.5 h-3.5", ev.isFeatured && "fill-amber-400 text-amber-400")} />
                          <span className="hidden sm:inline">{ev.isFeatured ? "Featured" : "Feature"}</span>
                        </button>

                        {ev.registrationUrl && ev.registrationUrl !== "#" && (
                          <a 
                            href={ev.registrationUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 hover:bg-slate-800 text-sky-400 hover:text-sky-300 rounded-lg transition-colors text-xs font-mono font-bold flex items-center gap-1"
                            title="Test Registration Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Test Link</span>
                          </a>
                        )}
                        <button onClick={() => openEventModal(ev)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors" title="Edit">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. TEAM MEMBERS MANAGER */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Team Members Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage Executive Board and Core Committee members.</p>
                </div>
                <button
                  onClick={() => openTeamModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {/* Search, Role Tabs & Team Domain Filter Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search members by name, role, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {/* Role Tabs */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                    {[
                      { id: "all", label: "All Members" },
                      { id: "executive", label: "Executive Board" },
                      { id: "core", label: "Core Committee" },
                      { id: "members", label: "General Members" }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setTeamRoleFilter(filter.id)}
                        className={cn(
                          "px-3 py-1 rounded-lg text-xs font-bold transition-all",
                          teamRoleFilter === filter.id ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-white"
                        )}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Team Domain Filter Dropdown */}
                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
                    <span className="text-xs font-mono text-slate-400 font-bold">Domain:</span>
                    <select
                      value={teamDomainFilter}
                      onChange={(e) => setTeamDomainFilter(e.target.value)}
                      className="bg-slate-900 text-xs text-sky-400 font-bold px-2 py-1 rounded-lg border border-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                    >
                      <option value="all">All Teams / Domains</option>
                      <option value="technical">Technical Team</option>
                      <option value="designing">Designing Team</option>
                      <option value="content">Content Team</option>
                      <option value="marketing">PR &amp; Marketing Team</option>
                      <option value="photography">Photography Team</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTeam.length === 0 ? (
                  <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No team members found matching your search.</div>
                ) : (
                  filteredTeam.map((member) => {
                    const posUpper = (member.position || "").toUpperCase();
                    const lvl = member.level || (
                      posUpper.includes("PRESIDENT") ? (posUpper.includes("VICE") ? 2 : 1) :
                      posUpper.includes("HEAD") ? (posUpper.includes("CO-HEAD") || posUpper.includes("CO HEAD") ? 4 : 3) : 5
                    );

                    const isExec = lvl === 1 || lvl === 2 || posUpper.includes("PRESIDENT");
                    const isCoreLead = (lvl === 3 || lvl === 4 || posUpper.includes("HEAD") || posUpper.includes("CO-HEAD") || posUpper.includes("LEAD")) && !isExec;

                    const tierLabel = isExec ? "👑 Executive" :
                      isCoreLead ? "⭐ Core Lead" : "Member";

                    const cardStyle = isExec 
                      ? "bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20" 
                      : isCoreLead 
                      ? "bg-gradient-to-r from-sky-950/40 via-slate-900/90 to-slate-900/90 border-sky-500/40 shadow-lg shadow-sky-950/20" 
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700";

                    const tierBadgeStyle = isExec 
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40 font-extrabold" 
                      : isCoreLead 
                      ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-extrabold" 
                      : "bg-slate-800 text-slate-400 border-slate-700 font-medium";

                    return (
                      <div key={member.id} className={cn("p-4 rounded-2xl border flex items-start justify-between gap-4 transition-all relative overflow-hidden", cardStyle)}>
                        {/* Glow indicator bar for leaders */}
                        {(isExec || isCoreLead) && (
                          <div className={cn("absolute left-0 top-0 bottom-0 w-1", isExec ? "bg-purple-500" : "bg-sky-400")} />
                        )}
                        <div className="flex items-center gap-3">
                          <img src={member.image} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 shrink-0" />
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">{member.position}</span>
                              <span className={cn("text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-bold", tierBadgeStyle)}>
                                {tierLabel}
                              </span>
                            </div>
                            <h4 className="text-base font-bold text-white">{member.name}</h4>
                            <p className="text-xs text-slate-400 line-clamp-1">{member.bio || "Active contributor"}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {member.skills && member.skills.slice(0, 3).map((s, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleDuplicateTeam(member)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-lg transition-colors" title="Duplicate">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openTeamModal(member)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteTeam(member.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 4. ABOUT & ECOSYSTEM MANAGER */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">About &amp; Ecosystem Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage the 5 Sub-Teams domain wings and 4 Foundational Core Values.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex gap-1">
                    <button
                      onClick={() => { setAboutSubTab("subteams"); setSearchQuery(""); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "subteams" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Sub-Teams ({subTeams.length})
                    </button>
                    <button
                      onClick={() => { setAboutSubTab("corevalues"); setSearchQuery(""); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        aboutSubTab === "corevalues" ? "bg-sky-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      )}
                    >
                      Core Values ({coreValues.length})
                    </button>
                  </div>
                  <button
                    onClick={() => aboutSubTab === "subteams" ? openSubTeamModal() : openCoreValueModal()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add {aboutSubTab === "subteams" ? "Sub-Team" : "Core Value"}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Teams View */}
              {aboutSubTab === "subteams" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSubTeams.map((st) => (
                    <div key={st.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/30">
                            {st.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500">Theme: {st.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{st.title}</h4>
                        <p className="text-xs text-slate-300 mt-1">{st.frontDesc}</p>
                        <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 font-bold block mb-0.5">Flip Back Description:</span>
                          {st.backDesc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {st.points.map((pt, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button onClick={() => openSubTeamModal(st)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteSubTeam(st.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Core Values View */}
              {aboutSubTab === "corevalues" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCoreValues.map((cv) => (
                    <div key={cv.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            {cv.category}
                          </span>
                          <span className="text-xs font-mono text-slate-500">Theme: {cv.color}</span>
                        </div>
                        <h4 className="text-lg font-bold text-white">{cv.title}</h4>
                        <p className="text-xs text-slate-300 mt-1">{cv.frontDesc}</p>
                        <p className="text-xs text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                          <span className="text-slate-500 font-bold block mb-0.5">Flip Back Principle:</span>
                          {cv.backDesc}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cv.points.map((pt, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                              ✓ {pt}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button onClick={() => openCoreValueModal(cv)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteCoreValue(cv.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. HALL OF FAME & ALUMNI LEADERS */}
          {activeTab === "legacy" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Hall of Fame &amp; Alumni Leaders</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage alumni leaders, their companies (Google, Microsoft, etc.), and career paths.</p>
                </div>
                <button
                  onClick={() => openLegacyModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Alumni Leader</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search alumni by name, tenure, placement company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLegacy.map((leader) => (
                  <div key={leader.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4 hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <img src={leader.image} alt={leader.name} className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                            Placed @ {leader.placedAt || "Alumni"}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">{leader.tenure}</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{leader.name}</h4>
                        <span className="text-xs text-sky-400 block">{leader.role}</span>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{leader.bio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => openLegacyModal(leader)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteLegacy(leader.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. NEWS GAZETTE ISSUES */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">News Gazette &amp; PDF Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Upload and manage monthly PDF publications and feature editions.</p>
                </div>
                <button
                  onClick={() => openNewsModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gazette Edition</span>
                </button>
              </div>

              <div className="space-y-3">
                {filteredNews.map((issue) => (
                  <div key={issue.id} className={cn(
                    "p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all",
                    issue.isCurrent ? "bg-sky-950/20 border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]" : "bg-slate-900/80 border-slate-800"
                  )}>
                    <div className="flex items-center gap-4">
                      <img src={issue.coverImage} alt={issue.title} className="w-16 h-20 rounded-xl object-cover border border-slate-700 shrink-0 shadow-md" />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700 font-bold">
                            {issue.volume} • {issue.month} {issue.year}
                          </span>
                          {issue.isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                              Active Live Edition
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">{issue.fileSize} • {issue.pageCount} Pages</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{issue.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{issue.description}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {issue.topics.map((tp, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              #{tp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      {!issue.isCurrent && (
                        <button
                          onClick={() => handleSetCurrentNews(issue.id)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700"
                        >
                          Set as Live
                        </button>
                      )}
                      <button onClick={() => openNewsModal(issue)} className="p-2 hover:bg-slate-800 text-slate-300 hover:text-sky-400 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteNews(issue.id)} className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6.5. NEWSLETTER SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Newsletter &amp; Subscribers Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">View, filter, and export students &amp; professionals subscribed to CSI Gazette.</p>
                </div>
                <button
                  onClick={handleExportSubscribersCSV}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Subscribers (CSV)</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search subscribers by email address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              {/* Subscribers Table List */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                      Subscribers Directory ({filteredSubscribers.length})
                    </span>
                  </div>
                </div>

                {filteredSubscribers.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Mail className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-medium">No newsletter subscribers found matching your search.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {filteredSubscribers.map((sub, idx) => (
                      <div key={sub.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono text-xs font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white font-mono">{sub.email}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                                Active
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              Subscribed: {sub.created_at ? new Date(sub.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sub.email);
                              showToast(`Copied ${sub.email} to clipboard!`);
                            }}
                            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-sky-400 rounded-lg transition-colors"
                            title="Copy Email"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id || sub.email)}
                            className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. GALLERY MOMENTS */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Gallery Moments Manager</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage photo memories, hackathon photos, and event captures.</p>
                </div>
                <button
                  onClick={() => openGalleryModal()}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search photos by title, caption..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                  {["all", "small", "large", "wide", "tall"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setGallerySizeFilter(sz)}
                      className={cn(
                        "px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all",
                        gallerySizeFilter === sz ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"
                      )}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredGallery.map((photo) => (
                  <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/80 shadow-md">
                    <img src={photo.image} alt={photo.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {photo.size}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-white truncate">{photo.title}</h5>
                      <p className="text-[10px] text-slate-400 truncate">{photo.detail || "Moment capture"}</p>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 p-1 rounded-lg backdrop-blur-sm">
                      <button onClick={() => openGalleryModal(photo)} className="p-1 text-slate-300 hover:text-sky-400">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteGallery(photo.id)} className="p-1 text-slate-300 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. HOMEPAGE STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-white">Homepage Metrics &amp; Achievements</h2>
                <p className="text-xs text-slate-400 mt-0.5">Edit high-level statistics shown in the homepage metrics grid.</p>
              </div>

              <form onSubmit={handleSaveStats} className="space-y-4 max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Events Hosted</label>
                    <input
                      type="text"
                      value={stats.eventsHosted}
                      onChange={(e) => setStats({ ...stats, eventsHosted: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Active Members</label>
                    <input
                      type="text"
                      value={stats.activeMembers}
                      onChange={(e) => setStats({ ...stats, activeMembers: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Live Projects</label>
                    <input
                      type="text"
                      value={stats.liveProjects}
                      onChange={(e) => setStats({ ...stats, liveProjects: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Placement Record</label>
                    <input
                      type="text"
                      value={stats.placementRate}
                      onChange={(e) => setStats({ ...stats, placementRate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                >
                  Save Metrics Changes
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* UNIVERSAL RESPONSIVE MODAL POPUP FOR ADD / EDIT */}
      {/* ========================================================================= */}
      {modalMode && (
        <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md overflow-y-auto overflow-x-hidden pt-20 sm:pt-24 pb-12 px-4 flex flex-col justify-start sm:justify-center items-center min-h-screen">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-auto max-h-[85vh] overflow-y-auto shadow-2xl relative">
            
            {/* Sticky Header with Title and Close Button */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80 sticky top-0 bg-slate-900 z-20 -mx-6 sm:-mx-8 px-6 sm:px-8 -mt-2 pt-2">
              <h3 className="text-lg sm:text-xl font-bold text-white pr-2 truncate">
                {modalMode === "add" ? "Add New" : "Edit"} {
                  activeTab === "events" ? "Event" :
                  activeTab === "team" ? "Team Member" :
                  activeTab === "about" ? (aboutSubTab === "subteams" ? "Sub-Team Domain Wing" : "Core Value Pillar") :
                  activeTab === "legacy" ? "Hall of Fame Leader" :
                  activeTab === "news" ? "News Gazette Edition" : "Gallery Photo"
                }
              </h3>
              <button 
                type="button"
                onClick={() => setModalMode(null)} 
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all shrink-0 border border-slate-700/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* EVENT FORM */}
            {activeTab === "events" && (
              <form onSubmit={handleSaveEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Event Title</label>
                  <input type="text" required placeholder="e.g. Hackathon Decoded 2024" value={eventForm.title || ""} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Interactive Date Field with Calendar Picker */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-bold">
                        <CalendarIcon className="w-3.5 h-3.5 text-sky-400" />
                        <span>Date</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Calendar Picker</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs cursor-pointer focus:border-sky-500 shrink-0 [color-scheme:dark]"
                        onChange={(e) => {
                          if (e.target.value) {
                            const [year, month, day] = e.target.value.split('-');
                            const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const formatted = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                            setEventForm({ ...eventForm, date: formatted });
                          }
                        }}
                      />
                      <input
                        type="text"
                        placeholder="e.g. September 15, 2026"
                        required
                        value={eventForm.date || ""}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500"
                      />
                    </div>
                  </div>

                  {/* Interactive Time / Duration Field with Clock Picker & Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-bold">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>Time / Duration</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">Clock &amp; Presets</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs cursor-pointer focus:border-sky-500 shrink-0 [color-scheme:dark]"
                        onChange={(e) => {
                          if (e.target.value) {
                            const [hStr, mStr] = e.target.value.split(':');
                            let h = parseInt(hStr, 10);
                            const ampm = h >= 12 ? "PM" : "AM";
                            h = h % 12 || 12;
                            const formattedH = h < 10 ? `0${h}` : `${h}`;
                            const timeFormatted = `${formattedH}:${mStr} ${ampm}`;
                            setEventForm({ ...eventForm, time: timeFormatted });
                          }
                        }}
                      />
                      <input
                        type="text"
                        placeholder="e.g. 10:00 AM (48 Hrs)"
                        value={eventForm.time || ""}
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500"
                      />
                    </div>
                    {/* Quick Duration & Time Presets */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {["10:00 AM", "02:00 PM", "10:00 AM (Full Day)", "10:00 AM (24 Hrs)", "10:00 AM (48 Hrs)"].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setEventForm({ ...eventForm, time: preset })}
                          className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 hover:border-sky-500 hover:text-sky-400 transition-colors"
                        >
                          + {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
                    <select value={eventForm.category || "upcoming"} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="current">Current / Live</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Location</label>
                    <input type="text" placeholder="e.g. Main Auditorium / Lab 3" value={eventForm.location || ""} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1 font-bold">
                    Banner Photo (File Upload OR Image URL)
                  </label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. /events/python.jpg or https://...)" 
                      value={eventForm.image || ""} 
                      onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" 
                    />
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setEventSelectedFile(file);
                          const localPreview = URL.createObjectURL(file);
                          setEventForm({ ...eventForm, image: localPreview });
                        }
                      }} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30 cursor-pointer" 
                    />
                  </div>
                  {/* Image Preview */}
                  {(eventForm.image || eventSelectedFile) && (
                    <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-800 h-28 bg-black relative">
                      <img src={eventSelectedFile ? URL.createObjectURL(eventSelectedFile) : eventForm.image} alt="Banner Preview" className="w-full h-full object-cover object-top" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700 font-mono">
                        Banner Preview
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1 font-bold">Event Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Provide detailed information about workshops, speakers, eligibility, prerequisites, and event goals..." 
                    value={eventForm.description || ""} 
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-sky-500 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Registration Link (Optional)</label>
                  <input type="text" placeholder="https://forms.google.com/... or /events/..." value={eventForm.registrationUrl || ""} onChange={(e) => setEventForm({ ...eventForm, registrationUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    id="isFeaturedToggle"
                    checked={eventForm.isFeatured ?? true}
                    onChange={(e) => setEventForm({ ...eventForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedToggle" className="text-xs font-bold text-slate-200 cursor-pointer flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Display as Featured Highlight on Homepage</span>
                  </label>
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Event</button>
              </form>
            )}

            {/* TEAM FORM */}
            {activeTab === "team" && (
              <form onSubmit={handleSaveTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Name</label>
                  <input type="text" required placeholder="e.g. John Doe" value={teamForm.name || ""} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Position / Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Technical Head, Co-Head, PR & Marketing Member" 
                    required 
                    value={teamForm.position || ""} 
                    onChange={(e) => {
                      const posVal = e.target.value;
                      const pUpper = posVal.toUpperCase();
                      let autoLevel = teamForm.level || 5;
                      let autoDomain = teamForm.domain || "technical";

                      if (pUpper.includes("PRESIDENT") && !pUpper.includes("VICE")) autoLevel = 1;
                      else if (pUpper.includes("VICE PRESIDENT") || pUpper.includes("VP")) autoLevel = 2;
                      else if (pUpper.includes("HEAD") && !(pUpper.includes("CO-HEAD") || pUpper.includes("CO HEAD"))) autoLevel = 3;
                      else if (pUpper.includes("CO-HEAD") || pUpper.includes("CO HEAD") || pUpper.includes("LEAD")) autoLevel = 4;
                      else if (pUpper.includes("MEMBER")) autoLevel = 5;

                      if (pUpper.includes("DESIGN") || pUpper.includes("UI/UX")) autoDomain = "design";
                      else if (pUpper.includes("CONTENT")) autoDomain = "content";
                      else if (pUpper.includes("PHOTO") || pUpper.includes("SOCIAL") || pUpper.includes("MEDIA")) autoDomain = "photo";
                      else if (pUpper.includes("PR") || pUpper.includes("MARKETING") || pUpper.includes("OUTREACH")) autoDomain = "pr";
                      else if (pUpper.includes("TECH") || pUpper.includes("CODE")) autoDomain = "technical";

                      setTeamForm({ ...teamForm, position: posVal, level: autoLevel, domain: autoDomain });
                    }} 
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Branch</label>
                  <input type="text" placeholder="e.g. CSE, IT, DS, AL" value={teamForm.branch || ""} onChange={(e) => setTeamForm({ ...teamForm, branch: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Hierarchy Level</label>
                    <select value={teamForm.level || 5} onChange={(e) => setTeamForm({ ...teamForm, level: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value={1}>Level 1 (President)</option>
                      <option value={2}>Level 2 (VP)</option>
                      <option value={3}>Level 3 (Head)</option>
                      <option value={4}>Level 4 (Co-head)</option>
                      <option value={5}>Level 5 (Member)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Domain Wing</label>
                    <select value={teamForm.domain || "technical"} onChange={(e) => setTeamForm({ ...teamForm, domain: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="technical">Technical</option>
                      <option value="content">Content</option>
                      <option value="design">Design</option>
                      <option value="photo">Photography</option>
                      <option value="pr">PR &amp; Marketing</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1 font-bold">Profile Photo (File Upload OR Image URL)</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. /team/aditya.jpg or https://...)" 
                      value={teamForm.image || ""} 
                      onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" 
                    />
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const f = e.target.files[0];
                          setTeamSelectedFile(f);
                          const localPreview = URL.createObjectURL(f);
                          setTeamForm({ ...teamForm, image: localPreview });
                        }
                      }} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30 cursor-pointer" 
                    />
                  </div>
                  
                  {/* Live Photo Preview */}
                  {(teamForm.image || teamSelectedFile) && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <img 
                        src={teamSelectedFile ? URL.createObjectURL(teamSelectedFile) : teamForm.image} 
                        alt="Profile Preview" 
                        className="w-12 h-12 rounded-full object-cover border border-sky-500/50 shadow-md shrink-0" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }} 
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block">Live Thumbnail Preview</span>
                        <span className="text-xs text-slate-400 font-mono truncate block">
                          {teamSelectedFile ? `File: ${teamSelectedFile.name}` : (teamForm.image || "Default")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Skills (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Full-Stack, Cloud, DSA" value={teamForm.skillsText || ""} onChange={(e) => setTeamForm({ ...teamForm, skillsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Bio / Role Description</label>
                  <textarea rows={2} placeholder="Brief summary of member's responsibilities" value={teamForm.bio || ""} onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">LinkedIn URL</label>
                    <input type="text" placeholder="https://linkedin.com/in/..." value={teamForm.socials?.linkedin || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, linkedin: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">GitHub URL</label>
                    <input type="text" placeholder="https://github.com/..." value={teamForm.socials?.github || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, github: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email</label>
                    <input type="email" placeholder="e.g. name@example.com" value={teamForm.socials?.email || ""} onChange={(e) => setTeamForm({ ...teamForm, socials: { ...teamForm.socials, email: e.target.value } })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md">
                  {isUploading ? "Uploading Image & Saving..." : "Save Member"}
                </button>
              </form>
            )}

            {/* ABOUT SUB-TEAM FORM */}
            {activeTab === "about" && aboutSubTab === "subteams" && (
              <form onSubmit={handleSaveSubTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Sub-Team Title</label>
                  <input type="text" required placeholder="e.g. Technical Team" value={subTeamForm.title || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Domain Category</label>
                    <input type="text" placeholder="e.g. Core Engineering" value={subTeamForm.category || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={subTeamForm.color || "sky"} onChange={(e) => setSubTeamForm({ ...subTeamForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="purple">Purple</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={subTeamForm.frontDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed role description on flip back" value={subTeamForm.backDesc || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Key Focus Points (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Next.js & Cloud, AI Pipelines, Open Source" value={subTeamForm.pointsText || ""} onChange={(e) => setSubTeamForm({ ...subTeamForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Sub-Team</button>
              </form>
            )}

            {/* ABOUT CORE VALUE FORM */}
            {activeTab === "about" && aboutSubTab === "corevalues" && (
              <form onSubmit={handleSaveCoreValue} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Title</label>
                  <input type="text" required placeholder="e.g. Hackathons & Tech Talks" value={coreValueForm.title || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Category</label>
                    <input type="text" placeholder="e.g. Innovation & Build" value={coreValueForm.category || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, category: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Accent Theme</label>
                    <select value={coreValueForm.color || "sky"} onChange={(e) => setCoreValueForm({ ...coreValueForm, color: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                      <option value="sky">Sky Blue</option>
                      <option value="blue">Royal Blue</option>
                      <option value="cyan">Electric Cyan</option>
                      <option value="indigo">Indigo</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Front Short Description</label>
                  <input type="text" required placeholder="Short summary displayed on front of card" value={coreValueForm.frontDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, frontDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Back Full Description</label>
                  <textarea rows={3} placeholder="Detailed principle description on flip back" value={coreValueForm.backDesc || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, backDesc: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Pillar Deliverables (Comma-separated)</label>
                  <input type="text" placeholder="e.g. 24-48h Sprints, Industry Speakers, Tech Workshops" value={coreValueForm.pointsText || ""} onChange={(e) => setCoreValueForm({ ...coreValueForm, pointsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Core Value</button>
              </form>
            )}

            {/* LEGACY LEADER FORM */}
            {activeTab === "legacy" && (
              <form onSubmit={handleSaveLegacy} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Leader Name</label>
                  <input type="text" placeholder="e.g. Rahul Sharma" required value={legacyForm.name || ""} onChange={(e) => setLegacyForm({ ...legacyForm, name: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Role Title</label>
                    <input type="text" placeholder="e.g. President (2022-2023)" value={legacyForm.role || ""} onChange={(e) => setLegacyForm({ ...legacyForm, role: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Placed At Company</label>
                    <input type="text" placeholder="e.g. Google, Microsoft, Amazon" value={legacyForm.placedAt || ""} onChange={(e) => setLegacyForm({ ...legacyForm, placedAt: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Tenure Period</label>
                    <input type="text" placeholder="e.g. 2022-2023" value={legacyForm.tenure || ""} onChange={(e) => setLegacyForm({ ...legacyForm, tenure: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Highlight Tag</label>
                    <input type="text" placeholder="e.g. SDE @ Google • 10+ Hackathons" value={legacyForm.highlight || ""} onChange={(e) => setLegacyForm({ ...legacyForm, highlight: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1 font-bold">Leader Photo (File Upload OR Image URL)</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. /team/legacy.jpg or https://...)" 
                      value={legacyForm.image || ""} 
                      onChange={(e) => setLegacyForm({ ...legacyForm, image: e.target.value })} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" 
                    />
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const f = e.target.files[0];
                          setLegacySelectedFile(f);
                          const localPreview = URL.createObjectURL(f);
                          setLegacyForm({ ...legacyForm, image: localPreview });
                        }
                      }} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30 cursor-pointer" 
                    />
                  </div>
                  {(legacySelectedFile || legacyForm.image) && (
                    <div className="mt-2.5 flex items-center gap-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                      <img 
                        src={legacySelectedFile ? URL.createObjectURL(legacySelectedFile) : legacyForm.image} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-full object-cover border border-sky-500/50 shadow-md shrink-0" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }} 
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block">Photo Preview</span>
                        <span className="text-xs text-slate-400 font-mono truncate block">
                          {legacySelectedFile ? `File: ${legacySelectedFile.name}` : (legacyForm.image || "Default")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Contribution Story / Bio</label>
                  <textarea rows={3} required value={legacyForm.bio || ""} onChange={(e) => setLegacyForm({ ...legacyForm, bio: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Hall of Fame Leader</button>
              </form>
            )}

            {/* NEWS & GAZETTE FORM */}
            {activeTab === "news" && (
              <form onSubmit={handleSaveNews} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Gazette Title</label>
                  <input type="text" required value={newsForm.title || ""} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Volume</label>
                    <input type="text" placeholder="e.g. Vol. 08" value={newsForm.volume || ""} onChange={(e) => setNewsForm({ ...newsForm, volume: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Month</label>
                    <input type="text" placeholder="e.g. October" value={newsForm.month || ""} onChange={(e) => setNewsForm({ ...newsForm, month: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Year</label>
                    <input type="text" placeholder="e.g. 2024" value={newsForm.year || ""} onChange={(e) => setNewsForm({ ...newsForm, year: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Direct PDF URL / Document Path</label>
                  <input type="text" required placeholder="e.g. /documents/gazette.pdf or https://example.com/gazette.pdf" value={newsForm.pdfUrl || ""} onChange={(e) => setNewsForm({ ...newsForm, pdfUrl: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Cover Thumbnail URL</label>
                  <input type="text" placeholder="e.g. /images/... or https://..." value={newsForm.coverImage || ""} onChange={(e) => setNewsForm({ ...newsForm, coverImage: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  {newsForm.coverImage && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-950 rounded-xl border border-slate-800">
                      <img src={newsForm.coverImage} alt="Preview" className="w-12 h-16 rounded object-cover border border-slate-700" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      <span className="text-xs text-slate-400 font-mono truncate">Cover Thumbnail Preview</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">File Size</label>
                    <input type="text" placeholder="e.g. 5.4 MB" value={newsForm.fileSize || ""} onChange={(e) => setNewsForm({ ...newsForm, fileSize: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Page Count</label>
                    <input type="number" placeholder="16" value={newsForm.pageCount || 16} onChange={(e) => setNewsForm({ ...newsForm, pageCount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Topics (Comma-separated)</label>
                  <input type="text" placeholder="e.g. Hackathon, AI, Web3, DSA" value={newsForm.topicsText || ""} onChange={(e) => setNewsForm({ ...newsForm, topicsText: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Summary / Highlights</label>
                  <textarea rows={2} value={newsForm.description || ""} onChange={(e) => setNewsForm({ ...newsForm, description: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="isCurrent" checked={Boolean(newsForm.isCurrent)} onChange={(e) => setNewsForm({ ...newsForm, isCurrent: e.target.checked })} className="rounded text-sky-500 focus:ring-sky-500 cursor-pointer" />
                  <label htmlFor="isCurrent" className="text-xs text-white font-medium cursor-pointer">Set as Current Active Live Edition (Embedded in browser reader)</label>
                </div>
                <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-all shadow-md">Save Gazette Edition</button>
              </form>
            )}

            {/* GALLERY FORM */}
            {activeTab === "gallery" && (
              <form onSubmit={handleSaveGallery} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Photo Title</label>
                  <input type="text" required value={galleryForm.title || ""} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1 font-bold font-mono">Photo Image (File Upload OR Image URL)</label>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="Image URL (e.g. /events/photo.jpg or https://...)" 
                      value={galleryForm.image || ""} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, image: e.target.value })} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono" 
                    />
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp, image/jpg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const f = e.target.files[0];
                          setGallerySelectedFile(f);
                          const localPreview = URL.createObjectURL(f);
                          setGalleryForm({ ...galleryForm, image: localPreview });
                        }
                      }} 
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30 cursor-pointer" 
                    />
                  </div>
                  {(gallerySelectedFile || galleryForm.image) && (
                    <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-800 h-28 bg-black relative">
                      <img 
                        src={gallerySelectedFile ? URL.createObjectURL(gallerySelectedFile) : galleryForm.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { (e.target as any).style.display = 'none'; }} 
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700 font-mono">
                        Gallery Photo Preview
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Grid Layout Span</label>
                  <select value={galleryForm.size || "small"} onChange={(e) => setGalleryForm({ ...galleryForm, size: e.target.value as any })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm">
                    <option value="small">Standard (1x1)</option>
                    <option value="large">Large Highlight (2x2)</option>
                    <option value="wide">Wide Banner (2x1)</option>
                    <option value="tall">Tall Portrait (1x2)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Caption Details</label>
                  <textarea rows={2} value={galleryForm.detail || ""} onChange={(e) => setGalleryForm({ ...galleryForm, detail: e.target.value })} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm" />
                </div>
                <button type="submit" disabled={isUploading} className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md">
                  {isUploading ? "Uploading Image & Saving..." : "Save Photo"}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

