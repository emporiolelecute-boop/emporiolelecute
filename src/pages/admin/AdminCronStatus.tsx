import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface CronJob {
  jobid: number;
  jobname: string;
  schedule: string;
  command: string;
  active: boolean;
}

interface CronRun {
  jobid: number;
  runid: number;
  status: string;
  return_message: string | null;
  start_time: string;
  end_time: string | null;
  command: string;
}

export default function AdminCronStatus() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [runs, setRuns] = useState<CronRun[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [j, r] = await Promise.all([
      supabase.rpc("list_cron_jobs" as any),
      supabase.rpc("list_cron_runs" as any, { p_limit: 100 }),
    ]);
    if (!j.error) setJobs((j.data as CronJob[]) ?? []);
    if (!r.error) setRuns((r.data as CronRun[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const lastRunByJob = new Map<number, CronRun>();
  for (const r of runs) {
    if (!lastRunByJob.has(r.jobid)) lastRunByJob.set(r.jobid, r);
  }

  return (
    <div className="space-y-6">
      <Helmet><title>Tarefas Agendadas | Admin</title></Helmet>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tarefas Agendadas</h1>
          <p className="text-muted-foreground text-sm">Status e histórico das rotinas automáticas (cron jobs).</p>
        </div>
        <Button onClick={load} disabled={loading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Jobs ({jobs.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Agendamento</TableHead>
                <TableHead>Ativo</TableHead>
                <TableHead>Última execução</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((j) => {
                const last = lastRunByJob.get(j.jobid);
                return (
                  <TableRow key={j.jobid}>
                    <TableCell className="font-medium">{j.jobname}</TableCell>
                    <TableCell><code className="text-xs">{j.schedule}</code></TableCell>
                    <TableCell>
                      <Badge variant={j.active ? "default" : "secondary"}>{j.active ? "sim" : "não"}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {last ? new Date(last.start_time).toLocaleString("pt-BR") : "—"}
                    </TableCell>
                    <TableCell>
                      {last ? (
                        <Badge variant={last.status === "succeeded" ? "default" : "destructive"} className="gap-1">
                          {last.status === "succeeded" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {last.status}
                        </Badge>
                      ) : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Últimas execuções ({runs.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mensagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((r) => {
                const job = jobs.find((j) => j.jobid === r.jobid);
                const dur = r.end_time
                  ? `${((new Date(r.end_time).getTime() - new Date(r.start_time).getTime()) / 1000).toFixed(2)}s`
                  : "—";
                return (
                  <TableRow key={`${r.jobid}-${r.runid}`}>
                    <TableCell className="font-medium">{job?.jobname ?? `#${r.jobid}`}</TableCell>
                    <TableCell className="text-xs">{new Date(r.start_time).toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-xs">{dur}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "succeeded" ? "default" : "destructive"}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-md truncate" title={r.return_message ?? ""}>
                      {r.return_message ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
