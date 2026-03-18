"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Clock, DollarSign, Lightbulb, CheckCircle, X, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PortfolioItem {
  id: string
  title: string
  description: string
  client_name: string
  image_url: string
  project_url: string
  tags: string[]
  problem_solved?: string
  income_generated?: string
  time_to_build?: string
  technologies_used?: string[]
  key_features?: string[]
  lessons_learned?: string
  status?: string
}

interface Company {
  primary_color: string
}

function getStatusColor(status?: string) {
  switch (status) {
    case "completed": return "bg-green-500/10 text-green-500 border-green-500/20"
    case "in_progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "maintenance": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "archived": return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    default: return "bg-green-500/10 text-green-500 border-green-500/20"
  }
}

function getStatusLabel(status?: string) {
  switch (status) {
    case "completed": return "Completed"
    case "in_progress": return "In Progress"
    case "maintenance": return "Ongoing"
    case "archived": return "Archived"
    default: return "Completed"
  }
}

export function CompanyPortfolio({ company, portfolio }: { company: Company; portfolio: PortfolioItem[] }) {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

  if (portfolio.length === 0) {
    return null
  }

  const hasDetails = (item: PortfolioItem) => 
    item.problem_solved || item.income_generated || item.time_to_build || 
    (item.technologies_used && item.technologies_used.length > 0) ||
    (item.key_features && item.key_features.length > 0) || item.lessons_learned

  return (
    <section id="portfolio" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Work</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Featured projects and success stories</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="overflow-hidden group cursor-pointer h-full"
                onClick={() => hasDetails(item) && setSelectedItem(item)}
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {item.image_url ? (
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: `${company.primary_color}20` }}
                    >
                      <span className="text-4xl font-bold" style={{ color: company.primary_color }}>
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <ExternalLink className="h-8 w-8 text-white" />
                    </a>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    {item.status && (
                      <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </Badge>
                    )}
                  </div>
                  {item.client_name && <p className="text-sm text-muted-foreground mb-2">Client: {item.client_name}</p>}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                  
                  {/* Quick stats */}
                  {(item.income_generated || item.time_to_build) && (
                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-muted-foreground">
                      {item.income_generated && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {item.income_generated}
                        </span>
                      )}
                      {item.time_to_build && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time_to_build}
                        </span>
                      )}
                    </div>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{item.tags.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  {hasDetails(item) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-2 text-xs"
                      style={{ color: company.primary_color }}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="text-xl">{selectedItem.title}</DialogTitle>
                      {selectedItem.client_name && (
                        <p className="text-sm text-muted-foreground mt-1">Client: {selectedItem.client_name}</p>
                      )}
                    </div>
                    {selectedItem.status && (
                      <Badge variant="outline" className={getStatusColor(selectedItem.status)}>
                        {getStatusLabel(selectedItem.status)}
                      </Badge>
                    )}
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {selectedItem.image_url && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={selectedItem.image_url}
                        alt={selectedItem.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <p className="text-muted-foreground">{selectedItem.description}</p>

                  {/* Stats Grid */}
                  {(selectedItem.income_generated || selectedItem.time_to_build) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.income_generated && (
                        <div className="p-4 rounded-lg bg-muted/50 border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <DollarSign className="h-4 w-4" />
                            Income Generated
                          </div>
                          <p className="text-lg font-semibold" style={{ color: company.primary_color }}>
                            {selectedItem.income_generated}
                          </p>
                        </div>
                      )}
                      {selectedItem.time_to_build && (
                        <div className="p-4 rounded-lg bg-muted/50 border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Clock className="h-4 w-4" />
                            Time to Build
                          </div>
                          <p className="text-lg font-semibold" style={{ color: company.primary_color }}>
                            {selectedItem.time_to_build}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedItem.problem_solved && (
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4" style={{ color: company.primary_color }} />
                        Problem Solved
                      </h4>
                      <p className="text-sm text-muted-foreground">{selectedItem.problem_solved}</p>
                    </div>
                  )}

                  {selectedItem.key_features && selectedItem.key_features.length > 0 && (
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4" style={{ color: company.primary_color }} />
                        Key Features
                      </h4>
                      <ul className="space-y-1">
                        {selectedItem.key_features.map((feature, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span style={{ color: company.primary_color }}>•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.technologies_used && selectedItem.technologies_used.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.technologies_used.map((tech, i) => (
                          <Badge key={i} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.lessons_learned && (
                    <div>
                      <h4 className="font-medium mb-2">Lessons Learned</h4>
                      <p className="text-sm text-muted-foreground">{selectedItem.lessons_learned}</p>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.project_url && (
                    <a
                      href={selectedItem.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: company.primary_color }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Project
                    </a>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
