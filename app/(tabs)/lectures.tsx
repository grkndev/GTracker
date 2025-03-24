import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import * as Haptics from 'expo-haptics';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

type ApiLecture = {
  _id: string;
  lecture: string;
  solved: number;
  solvedAt: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

type Lecture = {
  id: string;
  subject: string;
  score: number;
  date: string;
  rawDate: Date;
};

type SortField = "subject" | "score" | "date";
type SortDirection = "asc" | "desc";

export default function LecturesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  // Date range state
  const [fromDate, setFromDate] = useState<Date>(() => {
    const date = new Date();
    return subDays(date, 7); // Default: 1 week ago
  });
  const [toDate, setToDate] = useState<Date>(() => new Date()); // Default: today

  // Temporary dates for the date picker
  const [tempFromDate, setTempFromDate] = useState<Date>(() => {
    const date = new Date();
    return subDays(date, 7);
  });
  const [tempToDate, setTempToDate] = useState<Date>(() => new Date());

  // Date picker modal
  const datePickerModalRef = useRef<BottomSheetModal>(null);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);

  // Bottom sheet ref and snap points
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["32%"], []);
  const datePickerSnapPoints = useMemo(() => ["45%"], []);

  // Fetch data from the API - Make this function NOT depend on state values
  const fetchLecturesWithDates = useCallback(async (from: Date, to: Date) => {
    try {
      setIsLoading(true);
      setError(null);

      const fromDateISO = from.toISOString();
      const toDateISO = to.toISOString();

      const url = `https://sorucoz.grkn.dev/api/lectures?from=${fromDateISO}&to=${toDateISO}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error('Invalid API response format');
      }

      // Transform API data into our Lecture format
      const formattedLectures: Lecture[] = responseData.data.map((item: ApiLecture) => {
        const date = parseISO(item.solvedAt);
        return {
          id: item.id,
          subject: item.lecture,
          score: item.solved,
          date: format(date, 'dd MMM yy', { locale: tr }),
          rawDate: date
        };
      });

      setLectures(formattedLectures);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Wrapper function to fetch data with current date state
  const fetchLectures = useCallback(() => {
    return fetchLecturesWithDates(fromDate, toDate);
  }, [fetchLecturesWithDates, fromDate, toDate]);

  // Initial data fetch
  useEffect(() => {
    fetchLectures();
  }, []); // Only on mount

  const handleDateChange = (days: number, isFrom: boolean) => {
    if (isFrom) {
      const newDate = addDays(tempFromDate, days);
      // Prevent tempFromDate from being after tempToDate
      if (newDate <= tempToDate) {
        setTempFromDate(newDate);
      }
    } else {
      const newDate = addDays(tempToDate, days);
      // Prevent tempToDate from being before tempFromDate
      if (newDate >= tempFromDate) {
        setTempToDate(newDate);
      }
    }
  };

  const handlePresentDatePicker = (isFrom: boolean) => {
    // When opening date picker, initialize temp dates with current actual dates
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setIsSelectingFromDate(isFrom);
    datePickerModalRef.current?.present();
  };

  const handleApplyDateChange = () => {
    // Apply temp dates to actual dates and fetch data
    // Set the new date values
    setFromDate(tempFromDate);
    setToDate(tempToDate);

    // Dismiss the modal
    datePickerModalRef.current?.dismiss();

    // Add a small delay to ensure the modal is dismissed first
    setTimeout(() => {
      // Fetch with the new dates directly rather than using the state values
      // which might not have updated yet due to React's batching
      fetchLecturesWithDates(tempFromDate, tempToDate);
    }, 300);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handlePresentModalPress = useCallback((lecture: Lecture) => {
    try {
      setSelectedLecture(lecture);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      if (bottomSheetModalRef.current) {
        bottomSheetModalRef.current.present();
      } else {
        // Modal reference is null
      }
    } catch (error) {
      // Error handling
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setSelectedLecture(null);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />,
    []
  );

  const totalRecords = lectures.length;

  // Sorting functions
  const sortData = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if the same field is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <Ionicons name="swap-vertical" size={14} color="#666" />;
    }
    return sortDirection === "asc"
      ? <Ionicons name="chevron-up" size={14} color="#0284c7" />
      : <Ionicons name="chevron-down" size={14} color="#0284c7" />;
  };

  // Get sorted data
  const getSortedData = () => {
    const sortedData = [...lectures];

    // Filter by search query
    const filteredData = searchQuery
      ? sortedData.filter(lecture =>
        lecture.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      : sortedData;

    filteredData.sort((a, b) => {
      if (sortField === "subject") {
        return sortDirection === "asc"
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      } else if (sortField === "score") {
        return sortDirection === "asc"
          ? a.score - b.score
          : b.score - a.score;
      } else { // date
        return sortDirection === "asc"
          ? a.rawDate.getTime() - b.rawDate.getTime()
          : b.rawDate.getTime() - a.rawDate.getTime();
      }
    });

    return filteredData;
  };

  const sortedLectures = getSortedData();

  const handleDelete = () => {
    if (selectedLecture) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLectures(prevLectures => prevLectures.filter(lecture => lecture.id !== selectedLecture.id));
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const handleEdit = (lecture: Lecture) => {
    // In a real app, you might open a modal or navigate to an edit screen
  };

  const renderRightActions = (lecture: Lecture) => {
    return (
      <View className="flex-row">
        <TouchableOpacity
          className="bg-zinc-300 justify-center items-center px-4"
          onPress={() => handleEdit(lecture)}
        >
          <Ionicons name="create-outline" size={16} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 justify-center items-center px-4"
          onPress={() => handlePresentModalPress(lecture)}
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View className="flex-row bg-gray-100 py-3 px-4 border-b border-b-gray-200">
      <TouchableOpacity onPress={() => sortData("subject")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "subject" ? "text-blue-600" : "text-gray-800"}`}>Ders</Text>
          {getSortIcon("subject")}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortData("score")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "score" ? "text-blue-600" : "text-gray-800"}`}>Çözülen</Text>
          {getSortIcon("score")}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => sortData("date")} className="flex-1 flex-row items-center gap-1.5">
        <View className="flex-1 flex-row items-center gap-1.5">
          <Text className={`font-medium ${sortField === "date" ? "text-blue-600" : "text-gray-800"}`}>Tarih</Text>
          {getSortIcon("date")}
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderDateSelector = () => (
    <View className="flex-row gap-2 mb-4">
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 rounded-xl px-3 py-2"
        onPress={() => handlePresentDatePicker(true)}
      >
        <Text className="text-gray-700 text-sm">Başlangıç:</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-800 font-medium">{format(fromDate, 'dd MMM yyyy', { locale: tr })}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center gap-2 bg-gray-100 rounded-xl px-3 py-2"
        onPress={() => handlePresentDatePicker(false)}
      >
        <Text className="text-gray-700 text-sm">Bitiş:</Text>
        <View className="flex-row items-center">
          <Text className="text-gray-800 font-medium">{format(toDate, 'dd MMM yyyy', { locale: tr })}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white px-4 py-4">
      <View className="flex-row mb-4 gap-3">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-2xl px-3 py-0.5">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 text-gray-800 px-2 text-sm"
            placeholder="Ara"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          className="bg-blue-500 rounded-xl px-3 py-2 items-center justify-center"
          onPress={() => fetchLectures()}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {renderDateSelector()}

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0284c7" />
          <Text className="text-gray-600 mt-4">Veriler yükleniyor...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text className="text-red-500 text-center mt-4">Bir hata oluştu</Text>
          <Text className="text-gray-600 text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 bg-blue-500 py-2 px-6 rounded-lg"
            onPress={() => fetchLectures()}
          >
            <Text className="text-white">Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      ) : sortedLectures.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="document-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-center mt-4">Kayıt bulunamadı</Text>
          <Text className="text-gray-400 text-center mt-2">Seçilen tarih aralığında veri yok</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 rounded-xl overflow-hidden mb-4 border border-gray-200">
          {renderHeader()}

          {sortedLectures.map((lecture) => (
            <Swipeable
              key={lecture.id}
              renderRightActions={() => renderRightActions(lecture)}
              friction={2}
              overshootRight={false}
            >
              <View className="flex-row py-3 px-4 bg-white border-b border-b-gray-200">
                <Text className="flex-1 text-gray-800">{lecture.subject}</Text>
                <Text className="flex-1 text-gray-800">{lecture.score}</Text>
                <Text className="flex-1 text-gray-800">{lecture.date}</Text>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}

      <View className="flex-row justify-between items-center py-3">
        <Text className="text-gray-500 text-xs">
          Toplam {totalRecords} kayıt
        </Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-gray-500 text-xs">
            Sayfa {currentPage} / {Math.ceil(totalRecords / 10)}
          </Text>
          <View className="flex-row gap-1.5">
            <TouchableOpacity
              disabled={currentPage === 1}
              className={`bg-blue-500 rounded p-1.5 ${currentPage === 1 ? 'bg-gray-300' : ''}`}
            >
              <Ionicons name="chevron-back" size={16} color={currentPage === 1 ? "#666" : "#fff"} />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={currentPage === Math.ceil(totalRecords / 10)}
              className={`bg-blue-500 rounded p-1.5 ${currentPage === Math.ceil(totalRecords / 10) ? 'bg-gray-300' : ''}`}
            >
              <Ionicons name="chevron-forward" size={16} color={currentPage === Math.ceil(totalRecords / 10) ? "#666" : "#fff"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delete Confirmation Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose
      >
        <View className="flex-1 p-6 ">
          <Text className="text-xl font-medium text-gray-800 mb-2">Kaydı Sil</Text>
          <Text className="text-gray-600 mb-6">
            {selectedLecture ? `"${selectedLecture.subject}" kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.` : ''}
          </Text>
          <View className="flex-col justify-center items-center w-full gap-4">
            <TouchableOpacity
              onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="py-4 rounded-lg bg-gray-200 w-full items-center"
            >
              <Text className="text-gray-800 font-medium">İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="py-4 rounded-lg bg-red-500 w-full items-center"
            >
              <Text className="text-white font-medium">Sil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetModal>

      {/* Date Picker Bottom Sheet */}
      <BottomSheetModal
        ref={datePickerModalRef}
        index={0}
        snapPoints={datePickerSnapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        enableDynamicSizing={false}
      >
        <View className="flex-1 p-6">
          <Text className="text-xl font-medium text-gray-800 mb-6">
            {isSelectingFromDate ? 'Başlangıç Tarihi' : 'Bitiş Tarihi'}
          </Text>

          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-xl font-bold text-gray-800">
              {format(isSelectingFromDate ? tempFromDate : tempToDate, 'dd MMMM yyyy', { locale: tr })}
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="bg-gray-100 p-2 rounded-full"
                onPress={() => handleDateChange(-1, isSelectingFromDate)}
              >
                <Ionicons name="chevron-back" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-100 p-2 rounded-full"
                onPress={() => handleDateChange(1, isSelectingFromDate)}
              >
                <Ionicons name="chevron-forward" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={() => {
                const today = new Date();
                if (isSelectingFromDate) {
                  setTempFromDate(today);
                } else {
                  setTempToDate(today);
                }
              }}
            >
              <Text className="text-gray-800">Bugün</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={() => {
                const yesterday = subDays(new Date(), 1);
                if (isSelectingFromDate) {
                  setTempFromDate(yesterday);
                } else {
                  setTempToDate(yesterday);
                }
              }}
            >
              <Text className="text-gray-800">Dün</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 px-4 py-2 rounded-lg"
              onPress={() => {
                const lastWeek = subDays(new Date(), 7);
                if (isSelectingFromDate) {
                  setTempFromDate(lastWeek);
                } else {
                  setTempToDate(lastWeek);
                }
              }}
            >
              <Text className="text-gray-800">1 Hafta Önce</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="py-4 rounded-lg bg-blue-500 w-full items-center"
            onPress={handleApplyDateChange}
          >
            <Text className="text-white font-medium">Uygula</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </View>
  );
}