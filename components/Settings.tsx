import React, { useState } from 'react';
import { Settings as SettingsIcon, Code, Lock, Globe, Database } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backend');

  const djangoCode = {
    models: `from django.db import models

class Server(models.Model):
    STATUS_CHOICES = [
        ('ONLINE', 'Online'),
        ('WARNING', 'Warning'),
        ('CRITICAL', 'Critical'),
        ('OFFLINE', 'Offline')
    ]

    name = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    region = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ONLINE')
    cpu_usage = models.FloatField(default=0.0)
    memory_usage = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.ip_address})"

class LogEntry(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    level = models.CharField(max_length=10)
    message = models.TextField()`,
    
    views: `from rest_framework import viewsets
from rest_framework.response import Response
from .models import Server, LogEntry
from .serializers import ServerSerializer, LogEntrySerializer

class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    serializer_class = ServerSerializer

    def perform_create(self, serializer):
        # Logic for initial server handshake
        serializer.save()

class MetricIngestView(viewsets.APIView):
    def post(self, request):
        data = request.data
        server = Server.objects.get(name=data['server_name'])
        server.cpu_usage = data['cpu']
        server.memory_usage = data['memory']
        server.save()
        return Response({"status": "metrics_received"})`,
    
    urls: `from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServerViewSet, MetricIngestView

router = DefaultRouter()
router.register(r'servers', ServerViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('api/v1/ingest/', MetricIngestView.as_view()),
]`
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-400" />
          Settings & Developer Docs
        </h2>
      </div>

      <div className="flex flex-1 gap-6">
        {/* Settings Sidebar */}
        <div className="w-64 space-y-2">
          {[
            { id: 'general', label: 'General Config', icon: Globe },
            { id: 'backend', label: 'Backend Source', icon: Code },
            { id: 'security', label: 'API Keys & Security', icon: Lock },
            { id: 'db', label: 'Database Config', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'backend' ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Django Backend Implementation</h3>
                <p className="text-slate-400 text-sm mb-6">
                  Use the following Python code to deploy the actual backend service for Nexus Ops. 
                  Requires <code className="bg-slate-900 px-1 rounded text-slate-300">django</code> and <code className="bg-slate-900 px-1 rounded text-slate-300">djangorestframework</code>.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-cyan-400">models.py</span>
                    <span className="text-xs text-slate-500">Data Structures</span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-300 whitespace-pre">{djangoCode.models}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-cyan-400">views.py</span>
                    <span className="text-xs text-slate-500">API Logic</span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-300 whitespace-pre">{djangoCode.views}</code>
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-cyan-400">urls.py</span>
                    <span className="text-xs text-slate-500">Routing</span>
                  </div>
                  <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto">
                    <code className="text-sm font-mono text-slate-300 whitespace-pre">{djangoCode.urls}</code>
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <SettingsIcon className="w-12 h-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-slate-400">Configuration Protected</h3>
              <p className="text-sm max-w-md text-center mt-2">
                These settings are managed by your organization's administrator. Please view the Backend Source tab for implementation details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;